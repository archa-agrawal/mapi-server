exports.up = async function (knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("users", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.string("email").notNullable().unique();
    t.string("password").notNullable();
    t.string("first_name").notNullable();
    t.string("last_name").notNullable();
    t.string("avatar");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
