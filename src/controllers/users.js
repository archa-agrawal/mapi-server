const { Router } = require("express");
const {
  createUser,
  loginRequired,
  getUserProfile,
} = require("../helpers/users");
const passport = require("../auth/local");

module.exports = () => {
  const _login = (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
        });
      }
    })(req, res, next);
  };

  const router = Router();
  router.post("/register", async (req, res, next) => {
    await createUser(req.body);
    _login(req, res, next);
  });

  router.post("/login", (req, res, next) => {
    _login(req, res, next);
  });

  router.post("/logout", loginRequired, (req, res) => {
    req.logout(() => res.send("logged out"));
  });

  router.get("/profile", loginRequired, async (req, res) => {
    console.log(req.user);
    res.send(await getUserProfile(req.user));
  });

  return router;
};
