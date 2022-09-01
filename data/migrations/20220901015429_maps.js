exports.up = async function (knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("maps", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.string("heading").notNullable();
    t.string("description");
    t.string("theme").notNullable();
    t.uuid("creator_id").references("id").inTable("users").notNullable();
    t.timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("current_timestamp"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("maps");
};
