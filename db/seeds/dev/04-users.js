exports.seed = async knex => {
  global.spinner.start(`Generating users...`);

  const locationIds = await knex("api.locations")
    .select("id")
    .map(({ id }) => id);

  global.users = [
    {
      id: "00000000-0000-4000-8000-000000000401",
      email: "doris@sea.com",
      password: "Azerty123",
      name: "Doris L'Administratrice",
      role: "administrator",
      location_id: locationIds[0]
    },
    {
      id: "00000000-0000-4000-8000-000000000402",
      email: "nemo@sea.com",
      password: "Azerty123",
      name: "Nemo Le Contributeur",
      role: "contributor",
      location_id: locationIds[1]
    },
    {
      id: "00000000-0000-4000-8000-000000000403",
      email: "astrid@sea.com",
      password: "Azerty123",
      name: "Astrid La Contributrice",
      role: "contributor",
      location_id: locationIds[2]
    },
    {
      id: "00000000-0000-4000-8000-000000000404",
      email: "marin@sea.com",
      password: "Azerty123",
      name: "Marin Le Contributeur",
      role: "contributor",
      location_id: locationIds[3]
    },
    {
      id: "00000000-0000-4000-8000-000000000405",
      email: "deb@sea.com",
      password: "Azerty123",
      name: "Deb L'Administratrice Régionale",
      role: "regional_administrator",
      location_id: locationIds[3]
    }
  ];

  await knex("auth.users").insert(users);

  await knex("users_agreements").insert(
    (await knex("api.agreements").limit(3)).map(({ id: agreement_id }) => ({
      user_id: "00000000-0000-4000-8000-000000000402",
      agreement_id
    }))
  );
  await knex("users_agreements").insert(
    (await knex("api.agreements").limit(3)).map(({ id: agreement_id }) => ({
      user_id: "00000000-0000-4000-8000-000000000403",
      agreement_id
    }))
  );
  await knex("users_agreements").insert(
    (
      await knex("api.agreements")
        .limit(2)
        .offset(3)
    ).map(({ id: agreement_id }) => ({
      user_id: "00000000-0000-4000-8000-000000000404",
      agreement_id
    }))
  );

  global.spinner.succeed(`Users generated.`);
};
