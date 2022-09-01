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

const getUserProfile = async ({ email }) => {
  console.log("getting user");
  const dbUser = await knex("users").where({ email }).first();
  console.log("got user", dbUser);

  return {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    avatar: dbUser.avatar,
  };
};

module.exports = {
  createUser,
  loginRequired,
  getUserProfile,
};
