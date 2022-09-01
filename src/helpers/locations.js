const knex = require("../db");

const addLocation = async (
  { title, description, type, longitude, latitude, mapId },
  userId
) => {
  const map = await knex("maps")
    .where({ id: mapId, creator_id: userId })
    .first();
  if (map) {
    return knex("locations")
      .insert({
        title,
        description,
        type,
        longitude,
        latitude,
        map_id: mapId,
      })
      .returning("*");
  }
  return null;
};

const deleteLocation = async (id, userId) => {
  const { creator_id: creatorId } = await knex("locations as l")
    .where("l.id", id)
    .join("maps as m", "m.id", "=", "l.map_id")
    .select("creator_id")
    .first();
  if (userId === creatorId) {
    return knex("locations").where({ id }).delete();
  }
  return null;
};

module.exports = {
  addLocation,
  deleteLocation,
};
