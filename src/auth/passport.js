const passport = require("passport");
const knex = require("../db");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await knex("users").where({ id }).first();
      if (user) {
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  });
};
