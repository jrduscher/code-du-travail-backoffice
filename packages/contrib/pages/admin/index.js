import React from "react";
import { Flex } from "rebass";
import styled from "@emotion/styled";

import FranceMap from "../../src/components/FranceMap";
import _Table from "../../src/components/Table";
import Button from "../../src/elements/Button";
import ContentTitle from "../../src/elements/ContentTitle";
import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import shortenAgreementName from "../../src/helpers/shortenAgreementName";
import AdminMain from "../../src/layouts/AdminMain";
import customPostgrester from "../../src/libs/customPostgrester";
import numeral from "../../src/libs/customNumeral";

import { ANSWER_STATE } from "../../src/constants";
import Icon from "../../src/elements/Icon";

const COLUMNS = [
  {
    Header: "Nom",
    Cell: ({ value }) => <span title={value}>{value}</span>,
    accessor: "name"
  },
  {
    Header: "À rédiger",
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    accessor: "todo"
  },
  {
    Header: "En cours de rédaction",
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    accessor: "draft"
  },
  {
    Header: "À valider",
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    accessor: "pendingReview"
  },
  {
    Header: "En cours de validation",
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    accessor: "underReview"
  },
  {
    Header: "Validées",
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    accessor: "validated"
  },
  {
    Header: "Total",
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0,0")),
    accessor: "total"
  }
];
const PERCENTAGE_COLUMNS = [
  { ...COLUMNS[0] },
  {
    ...COLUMNS[1],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%"))
  },
  {
    ...COLUMNS[2],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%"))
  },
  {
    ...COLUMNS[3],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%"))
  },
  {
    ...COLUMNS[4],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%"))
  },
  {
    ...COLUMNS[5],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%"))
  },
  {
    ...COLUMNS[6],
    Cell: ({ value }) => (value === -1 ? "…" : numeral(value).format("0.00%")),
    sortable: false
  }
];

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;
const FranceMapContainer = styled(Flex)`
  margin-bottom: 1rem;

  svg {
    width: 20rem;
  }
`;
const Table = styled(_Table)`
  font-size: 0.875rem;

  .rt-tr > .rt-td {
    :first-of-type {
      cursor: help;
    }
    :not(:first-of-type) {
      text-align: right;
    }
  }
`;

const REFRESH_DELAY = 30000;

const StatsTable = ({ data, isPercentage, ...props }) => (
  <Table
    data={data}
    columns={isPercentage ? PERCENTAGE_COLUMNS : COLUMNS}
    filterable={false}
    multiSort={false}
    pageSize={data.length}
    resizable={false}
    showPagination={false}
    {...props}
  />
);

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agreementsStats: [],
      selectedRegionIsCalculating: false,
      selectedRegionName: "",
      selectedRegionStats: [],
      globalStats: [],
      isCalculating: true,
      isLoading: true,
      isPercentage: true,
      regionalStats: []
    };
  }

  async componentDidMount() {
    this.postgrest = customPostgrester();

    await this.initializeStats();
    await this.updateStats();
  }

  async fetchRegions() {
    const { data: regions } = await this.postgrest
      .eq("category", "region")
      .not.in("code", ["01", "02", "03", "04", "06"])
      .orderBy("name")
      .get("/areas");

    return regions;
  }

  async fetchRegionalLocations() {
    const { data: locations } = await this.postgrest
      .select("*")
      .select("agreements(id,idcc,name,parent_id)")
      .not.is("area_id", null)
      .get("/locations");

    return locations;
  }

  async fetchAnswersForAgreements(agreementIds) {
    const { data: answers } = await this.postgrest
      .select("*")
      .select("agreement(*)")
      .in("agreement_id", agreementIds)
      .get("/answers");

    return answers;
  }

  async initializeStats() {
    const regions = await this.fetchRegions();
    const regionalLocations = await this.fetchRegionalLocations();

    const agreementsStats = regionalLocations
      .reduce((prev, { agreements }) => [...prev, ...agreements], [])
      .map(({ id, idcc, name, parent_id }) => ({
        id,
        isNational: parent_id === null,
        name: `[${idcc}] ${shortenAgreementName(name)}`,
        totals: [0, 0, 0, 0, 0, 0]
      }));

    const regionalStats = regions.map(({ code, id, name }) => {
      const location = regionalLocations.find(({ area_id }) => area_id === id);

      return {
        locationName: location.name,
        locationId: location.id,
        agreements: location.agreements,
        // We do the mapping in advance for the sake of repeated performance:
        agreementIds: location.agreements.map(({ id }) => id),
        areaCode: code,
        areaId: id,
        areaName: name
      };
    });

    this.setState({
      agreementsStats,
      isLoading: false,
      regionalStats
    });
  }

  async updateStats() {
    const { agreementsStats, regionalStats } = this.state;

    const nextAgreementsStats = agreementsStats.map(agreementsStatsEntry => ({
      ...agreementsStatsEntry,
      totals: [0, 0, 0, 0, 0, 0]
    }));

    const nextRegionalStats = await Promise.all(
      regionalStats.map(async regionalStatsEntry => {
        const { agreementIds } = regionalStatsEntry;
        const answers = await this.fetchAnswersForAgreements(agreementIds);

        answers.forEach(({ agreement_id, state }) => {
          const agreementsStatsIndex = nextAgreementsStats.findIndex(
            ({ id }) => id === agreement_id
          );

          switch (state) {
            case ANSWER_STATE.TO_DO:
              nextAgreementsStats[agreementsStatsIndex].totals[0] += 1;
              break;

            case ANSWER_STATE.DRAFT:
              nextAgreementsStats[agreementsStatsIndex].totals[1] += 1;
              break;

            case ANSWER_STATE.PENDING_REVIEW:
              nextAgreementsStats[agreementsStatsIndex].totals[2] += 1;
              break;

            case ANSWER_STATE.UNDER_REVIEW:
              nextAgreementsStats[agreementsStatsIndex].totals[3] += 1;
              break;

            case ANSWER_STATE.VALIDATED:
              nextAgreementsStats[agreementsStatsIndex].totals[4] += 1;
              break;
          }

          nextAgreementsStats[agreementsStatsIndex].totals[5] += 1;
        });

        const totals = answers.reduce(
          (totals, { state }) => {
            switch (state) {
              case ANSWER_STATE.TO_DO:
                totals[0] += 1;
                break;

              case ANSWER_STATE.DRAFT:
                totals[1] += 1;
                break;

              case ANSWER_STATE.PENDING_REVIEW:
                totals[2] += 1;
                break;

              case ANSWER_STATE.UNDER_REVIEW:
                totals[3] += 1;
                break;

              case ANSWER_STATE.VALIDATED:
                totals[4] += 1;
                break;
            }

            totals[5] += 1;

            return totals;
          },
          [0, 0, 0, 0, 0, 0]
        );

        return {
          ...regionalStatsEntry,
          totals
        };
      })
    );

    const nextGlobalStats = nextRegionalStats.reduce(
      (globalTotals, { totals }) => [
        globalTotals[0] + totals[0],
        globalTotals[1] + totals[1],
        globalTotals[2] + totals[2],
        globalTotals[3] + totals[3],
        globalTotals[4] + totals[4],
        globalTotals[5] + totals[5]
      ],
      [0, 0, 0, 0, 0, 0]
    );

    this.setState({
      agreementsStats: nextAgreementsStats,
      globalStats: nextGlobalStats,
      isCalculating: false,
      regionalStats: nextRegionalStats
    });

    setTimeout(this.updateStats.bind(this), REFRESH_DELAY);
  }

  async updateSelectedRegionStats(areaCode) {
    const { regionalStats } = this.state;
    const region = regionalStats.find(entry => entry.areaCode === areaCode);

    const newSelectedRegionStats = region.agreements.map(({ id, idcc, name }) => ({
      agreementId: id,
      agreementIdcc: idcc,
      agreementName: `[${idcc}] ${name}`,
      totals: [0, 0, 0, 0, 0, 0]
    }));

    this.setState({
      selectedRegionIsCalculating: true,
      selectedRegionName: region.areaName,
      selectedRegionStats: newSelectedRegionStats
    });

    const answers = await this.fetchAnswersForAgreements(region.agreementIds);

    const nextSelectedRegionStats = newSelectedRegionStats.map(entry => {
      const totals = answers
        .filter(({ agreement_id }) => agreement_id === entry.agreementId)
        .reduce(
          (totals, { state }) => {
            switch (state) {
              case ANSWER_STATE.TO_DO:
                totals[0] += 1;
                break;

              case ANSWER_STATE.DRAFT:
                totals[1] += 1;
                break;

              case ANSWER_STATE.PENDING_REVIEW:
                totals[2] += 1;
                break;

              case ANSWER_STATE.UNDER_REVIEW:
                totals[3] += 1;
                break;

              case ANSWER_STATE.VALIDATED:
                totals[4] += 1;
                break;
            }

            totals[5] += 1;

            return totals;
          },
          [0, 0, 0, 0, 0, 0]
        );

      return {
        ...entry,
        totals
      };
    });

    this.setState({
      selectedRegionIsCalculating: false,
      selectedRegionStats: nextSelectedRegionStats
    });
  }

  generateDataRow(name, stats, isCalculating) {
    const { isPercentage } = this.state;

    if (isCalculating) {
      return {
        name,
        todo: -1,
        draft: -1,
        pendingReview: -1,
        underReview: -1,
        validated: -1,
        total: -1
      };
    }

    return {
      name,
      todo: isPercentage ? stats[0] / stats[5] : stats[0],
      draft: isPercentage ? stats[1] / stats[5] : stats[1],
      pendingReview: isPercentage ? stats[2] / stats[5] : stats[2],
      underReview: isPercentage ? stats[3] / stats[5] : stats[3],
      validated: isPercentage ? stats[4] / stats[5] : stats[4],
      total: isPercentage ? 1 : stats[5]
    };
  }

  getGlobalStats() {
    const { globalStats, isCalculating, isPercentage } = this.state;
    const data = [this.generateDataRow("Total", globalStats, isCalculating)];

    return <StatsTable data={data} isPercentage={isPercentage} sortable={false} />;
  }

  getRegionalStats() {
    const { isCalculating, isPercentage, regionalStats } = this.state;
    const data = regionalStats.map(({ areaName, totals }) =>
      this.generateDataRow(areaName, totals, isCalculating)
    );

    return (
      <StatsTable
        data={data}
        defaultSorted={[{ id: "validated", desc: false }]}
        isPercentage={isPercentage}
      />
    );
  }

  getSelectedRegionStats() {
    const { isPercentage, selectedRegionIsCalculating, selectedRegionStats } = this.state;
    const data = selectedRegionStats.map(({ agreementName, totals }) =>
      this.generateDataRow(agreementName, totals, selectedRegionIsCalculating)
    );

    return (
      <StatsTable
        data={data}
        defaultSorted={[{ id: "validated", desc: false }]}
        isPercentage={isPercentage}
      />
    );
  }

  getAgreementsStats(isNational = false) {
    const { agreementsStats, isCalculating, isPercentage } = this.state;
    const data = agreementsStats
      .filter(agreement => agreement.isNational === isNational)
      .map(({ name, totals }) => this.generateDataRow(name, totals, isCalculating));

    return (
      <StatsTable
        data={data}
        defaultSorted={[{ id: "name", desc: false }]}
        isPercentage={isPercentage}
      />
    );
  }

  render() {
    const { isLoading, isPercentage, selectedRegionName } = this.state;

    return (
      <AdminMain>
        <Container flexDirection="column">
          <Flex alignItems="baseline" justifyContent="space-between">
            <Title>Tableau de bord</Title>
            <Button onClick={() => this.setState({ isPercentage: !isPercentage })}>
              {isPercentage ? "Voir les nombres bruts" : "Voir les pourcentages"}
            </Button>
          </Flex>

          <Subtitle isFirst>Global</Subtitle>
          {isLoading ? <p>Calcul en cours…</p> : this.getGlobalStats()}

          <Subtitle>Par région</Subtitle>
          {isLoading ? <p>Calcul en cours…</p> : this.getRegionalStats()}

          <Subtitle>Par convention collective</Subtitle>
          <ContentTitle isFirst>Conventions nationales</ContentTitle>
          {isLoading ? <p>Calcul en cours…</p> : this.getAgreementsStats(true)}
          <ContentTitle>Conventions locales</ContentTitle>
          {isLoading ? <p>Calcul en cours…</p> : this.getAgreementsStats()}

          <Subtitle>Par région (détaillée)</Subtitle>
          {isLoading ? (
            <p>Calcul en cours…</p>
          ) : (
            <>
              <FranceMapContainer justifyContent="center" style={{ marginTop: "1rem" }}>
                <FranceMap onChange={this.updateSelectedRegionStats.bind(this)} />
              </FranceMapContainer>
              {selectedRegionName.length === 0 ? (
                <Flex alignItems="baseline" justifyContent="center" style={{ marginTop: "1rem" }}>
                  <Icon icon="arrow-up" style={{ marginRight: "1rem" }} />
                  Cliquez sur une région pour voir le détail.
                </Flex>
              ) : (
                <>
                  <ContentTitle>{selectedRegionName}</ContentTitle>
                  {this.getSelectedRegionStats()}
                </>
              )}
            </>
          )}
        </Container>
      </AdminMain>
    );
  }
}
