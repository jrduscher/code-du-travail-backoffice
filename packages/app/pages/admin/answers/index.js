import styled from "@emotion/styled";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import AdminAnswerBlock from "../../../src/blocks/AdminAnswer";
import Pagination from "../../../src/components/Pagination";
import { ANSWER_STATE_OPTIONS } from "../../../src/constants";
import Button from "../../../src/elements/Button";
import Input from "../../../src/elements/Input";
import Select from "../../../src/elements/Select";
import Title from "../../../src/elements/Title";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import T from "../../../src/texts";

const Container = styled(Flex)`
  flex-grow: 1;
  margin: 0 1rem 1rem;
`;
const List = styled(Flex)`
  flex-grow: 1;
  padding-right: 1rem;
  min-height: 0;
  overflow-y: auto;
`;

const Top = styled(Flex)`
  margin-bottom: 0.75rem;
`;
const FilterSelect = styled(Select)`
  margin-left: 1rem;
`;

const Text = styled.p`
  margin-bottom: 0.5rem;
`;
const HelpText = styled(Text)`
  font-size: 0.875rem;
`;

export class AdminAnswersIndexPage extends React.Component {
  get queryFilter() {
    return this.$queryFilter !== undefined && this.$queryFilter !== null
      ? this.$queryFilter.value
      : "";
  }

  componentDidMount() {
    const { isGeneric } = this.props;

    this.props.dispatch(actions.agreements.load());
    this.props.dispatch(actions.questions.load());
    this.props.dispatch(
      actions.answers.setFilters({
        isGeneric,
        pageLength: 10
      })
    );
  }

  setAgreeementsFilter(selected) {
    const agreements = selected !== null ? selected : [];
    this.props.dispatch(actions.answers.setFilter("agreements", agreements));
  }

  setPageFilter({ selected }) {
    this.props.dispatch(actions.answers.setFilter("page", selected));
  }

  setQuestionsFilter(selected) {
    const questions = selected !== null ? selected : [];
    this.props.dispatch(actions.answers.setFilter("questions", questions));
  }

  setQueryFilter() {
    this.props.dispatch(actions.answers.setFilter("query", this.queryFilter));
  }

  setStatesFilter(selected) {
    const states = selected !== null ? selected : [];
    this.props.dispatch(actions.answers.setFilter("states", states));
  }

  checkAnswer(id) {
    this.props.dispatch(actions.answers.toggleCheck([id]));
  }

  setCheckedAnswersState() {
    const { checked } = this.props.answers;
    const { value } = this.$newState.state.value;

    this.props.dispatch(
      actions.answers.updateState(checked, value, () => this.props.dispatch(actions.answers.load()))
    );
  }

  printAnswers() {
    const { isGeneric } = this.props;
    const path = isGeneric ? "generic-answers" : "answers";

    window.open(`/admin/${path}/print`, "_blank");
  }

  editAnswer(id) {
    const path = this.props.isGeneric ? "generic-answers" : "answers";

    if (process.env.NODE_ENV !== "development") {
      window.open(`/admin/${path}/${id}`, "_blank");

      return;
    }

    Router.push(`/admin/${path}/${id}`);
  }

  renderAnswersList() {
    const { checked, data, isLoading } = this.props.answers;

    if (isLoading || !Array.isArray(data)) {
      return <HelpText>Chargement…</HelpText>;
    }

    if (data.length === 0) {
      return <p>{T.ADMIN_ANSWERS_INFO_NO_DATA}</p>;
    }

    return data.map(answer => (
      <AdminAnswerBlock
        data={answer}
        isChecked={checked.includes(answer.id)}
        key={answer.id}
        onCheck={this.checkAnswer.bind(this)}
        onClick={this.editAnswer.bind(this)}
      />
    ));
  }

  render() {
    const { agreements, answers, isGeneric, questions } = this.props;

    const isLoading = isGeneric
      ? answers.isLoading
      : agreements.isLoading || answers.isLoading || questions.isLoading;
    const stateFilterAgreements = agreements.data.map(({ id, idcc, name }) => ({
      label: `[${idcc}] ${name}`,
      value: id
    }));
    const stateFilterQuestions = questions.data.map(({ id, index, value }) => ({
      label: `${index}) ${value}`,
      value: id
    }));
    const stateActionOptions = ANSWER_STATE_OPTIONS.filter(({ value }) => value !== answers.state);

    return (
      <AdminMainLayout hasBareContent>
        <Container flexDirection="column">
          <Top alignItems="baseline" justifyContent="space-between">
            <Title>{`Réponses${isGeneric ? " génériques" : ""}`}</Title>

            <Button disabled={isLoading} onClick={this.printAnswers.bind(this)}>
              Imprimer
            </Button>
          </Top>

          {/* Filters */}
          {!isGeneric && (
            <Flex alignItems="center">
              <Input
                defaultValue={answers.filters.query}
                icon="search"
                onChange={this.setQueryFilter.bind(this)}
                ref={node => (this.$queryFilter = node)}
              />
              {/* We must set the {instanceId} prop to avoid "Prop `id` did not match." warning. */}
              {/* https://github.com/trezor/trezor-suite/issues/290#issuecomment-516349580 */}
              <FilterSelect
                instanceId="statesFilter"
                isLoading={isLoading}
                isMulti
                onChange={this.setStatesFilter.bind(this)}
                options={ANSWER_STATE_OPTIONS}
                value={answers.filters.states}
              />
              <FilterSelect
                instanceId="agreementsFilter"
                isLoading={isLoading}
                isMulti
                onChange={this.setAgreeementsFilter.bind(this)}
                options={stateFilterAgreements}
                value={answers.filters.agreements}
              />
              <FilterSelect
                instanceId="questionsFilter"
                isLoading={isLoading}
                isMulti
                onChange={this.setQuestionsFilter.bind(this)}
                options={stateFilterQuestions}
                value={answers.filters.questions}
              />
            </Flex>
          )}

          {/* Actions */}
          {!isLoading && answers.checked.length > 0 && (
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <Select ref={node => (this.$newState = node)} options={stateActionOptions} />
                <Button onClick={this.setCheckedAnswersState.bind(this)}>Appliquer</Button>
              </Flex>
            </Flex>
          )}

          <List flexDirection="column">{this.renderAnswersList()}</List>
          {!isLoading && answers.pagesLength > 0 && (
            <Pagination
              initialPage={answers.filters.page}
              onPageChange={this.setPageFilter.bind(this)}
              pageCount={answers.pagesLength}
            />
          )}
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ agreements, answers, questions }) => ({
  agreements,
  answers,
  isGeneric: false,
  questions
}))(AdminAnswersIndexPage);
