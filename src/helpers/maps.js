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

const deleteMap = (mapId, userId) => {
  return knex("maps")
    .where({
      id: mapId,
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
      .select("first_name", "lasta_name")
      .first();
    const locations = await knex("locations")
      .where({
        map_id: id,
      })
      .select("id", "title", "description", "longitude", "latitude")
      .map(({ id, title, description, longitude, latitude }) => ({
        id,
        title,
        description,
        longitude,
        latitude,
      }));

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

const getMaps = (userId) => {
  return knex("maps as m")
    .join("users as u", "m.creator_id", "=", "u.id")
    .select(
      "m.id",
      "m.heading",
      "m.description",
      "m.theme",
      "m.creator_id",
      "u.first_name",
      "u.last_name",
      "u.avatar"
    )
    .map(
      ({
        id,
        heading,
        description,
        theme,
        creator_id: creatorId,
        first_name: firstName,
        last_name: lastName,
      }) => ({
        id,
        heading,
        description,
        theme,
        user: {
          firstName,
          lastName,
        },
        owned: userId === creatorId,
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
