exports.seed = async knex => {
  await knex("api.answers").del();
  await knex("api.questions").del();
  await knex("api.labor_agreements").del()
  await knex("basic_auth.users").del();
}