const { Router } = require("express");
const { createUser, loginRequired } = require("../helpers/users");
const passport = require("../auth/local");

module.exports = () => {
  const _login = (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }
      if (!user) res.sendStatus(401);
      else {
        req.logIn(user, (err) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          }
          res.send({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: user.avatar,
          });
        });
      }
    })(req, res, next);
  };

  const router = Router();
  router.post("/register", async (req, res, next) => {
    try {
      await createUser(req.body);
      _login(req, res, next);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  router.post("/login", (req, res, next) => {
    _login(req, res, next);
  });

  router.post("/logout", loginRequired, (req, res) => {
    req.logout(() => {
      res.sendStatus(200);
    });
  });

  router.get("/profile", loginRequired, async (req, res) => {
    res.send({
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      avatar: req.user.avatar,
    });
  });

  return router;
};
