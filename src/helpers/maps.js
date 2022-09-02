const knex = require("../db");

const addMap = ({ heading, description, theme }, userId) => {
  return knex("maps")
    .insert({
      heading,
      description,
      theme,
      creator_id: userId,
    })
    .returning("*");
};

const deleteMap = (id, userId) => {
  return knex("maps")
    .where({
      id,
      creator_id: userId,
    })
    .delete();
};

const updateMap = ({ id, heading, description, theme }, userId) => {
  return knex("maps")
    .where({
      id,
      creator_id: userId,
    })
    .update({
      heading,
      description,
      theme,
    });
};

const getMap = async (id, userId) => {
  const {
    heading,
    description,
    theme,
    creator_id: creatorId,
  } = await knex("maps")
    .where({
      id,
    })
    .select("heading", "description", "theme", "creator_id")
    .first();
  if (creatorId) {
    const { first_name: firstName, last_name: lastName } = await knex("users")
      .where({
        id: creatorId,
      })
      .select("first_name", "last_name")
      .first();
    const dbLocations = await knex("locations")
      .where({
        map_id: id,
      })
      .select("id", "title", "description", "longitude", "latitude", "type");
    const locations = dbLocations.map(
      ({ id, title, description, longitude, latitude, type }) => ({
        id,
        title,
        description,
        longitude,
        latitude,
        type,
      })
    );

    return {
      id,
      heading,
      description,
      theme,
      creator: {
        firstName,
        lastName,
      },
      owned: creatorId === userId,
      locations,
    };
  }
  return null;
};

const getMaps = async (userId) => {
  const maps = await knex("maps as m")
    .join("users as u", "m.creator_id", "=", "u.id")
    .select(
      "m.id",
      "m.heading",
      "m.description",
      "m.theme",
      "m.creator_id",
      "m.created_at",
      "u.first_name",
      "u.last_name",
      "u.avatar"
    );
  return maps.map(
    ({
      id,
      heading,
      description,
      theme,
      creator_id: creatorId,
      first_name: firstName,
      last_name: lastName,
      created_at: createdAt,
    }) => ({
      id,
      heading,
      description,
      theme,
      creator: {
        firstName,
        lastName,
      },
      owned: userId === creatorId,
      createdAt,
    })
  );
};

module.exports = {
  addMap,
  deleteMap,
  updateMap,
  getMap,
  getMaps,
};
