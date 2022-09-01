const bcrypt = require("bcrypt");
const knex = require("../db");

const createUser = async (user) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);
  await knex("users").insert({
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    avatar: user.avatar,
    password: hash,
  });
};

const loginRequired = (req, res, next) => {
  if (!req.user) return res.status(401).json({ status: "Please log in" });
  return next();
};

module.exports = {
  createUser,
  loginRequired,
};
