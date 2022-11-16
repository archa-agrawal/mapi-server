const knex = require("knex");

const knexFile = require("../knexfile");
const configOptions = knexFile;

module.exports = knex(configOptions);
