const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const userController = require("./controllers/users");
const mapController = require("./controllers/maps");
const locationController = require("./controllers/locations");
const knex = require("./db");

knex.migrate.latest().then(() => {
  const app = express();
  /*** middleware ***/
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: process.env.UI_SERVER,
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
      credentials: true,
    })
  );
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: true,
      saveUninitialized: false,
      cookie: {
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: false,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  /*** middleware end ***/

  app.use("/user", userController());
  app.use("/map", mapController());
  app.use("/location", locationController());

  app.listen(5000, () => {
    console.info("Server started");
  });
});
