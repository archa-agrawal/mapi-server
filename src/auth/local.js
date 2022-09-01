const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const init = require("./passport");
const knex = require("../db");
const bcrypt = require("bcrypt");

init();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await knex("users").where({ email }).first();
        if (!user) {
          return done(null, false);
        }
        const validPw = bcrypt.compareSync(password, user.password);
        if (validPw) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
