exports.up = async function (knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("locations", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.string("title").notNullable();
    t.string("description");
    t.float("longitude").notNullable();
    t.float("latitude").notNullable();
    t.string("type").notNullable();
    t.uuid("map_id").references("id").inTable("maps").notNullable();
  });
};

exports.down = function (knex) {};
