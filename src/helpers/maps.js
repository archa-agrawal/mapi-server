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
    .first();
  if (creatorId) {
    const { first_name: firstName, last_name: lastName } = await knex("users")
      .where({
        id: creatorId,
      })
      .first();
    const locations = await knex("locations")
      .where({
        map_id: id,
      })
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

module.exports = {
  addMap,
  deleteMap,
  updateMap,
  getMap,
};
