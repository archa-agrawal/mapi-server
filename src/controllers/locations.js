const { Router } = require("express");
const { loginRequired } = require("../helpers/users");
const { addLocation, deleteLocation } = require("../helpers/locations");

module.exports = () => {
  const router = Router();

  router.post("/", loginRequired, async (req, res) => {
    const location = await addLocation(req.body, req.user.id);
    if (location) {
      return res.send(location);
    }
    return res.sendStatus(404);
  });

  router.delete("/", loginRequired, async (req, res) => {
    const result = await deleteLocation(req.query.id, req.user.id);
    if (result) {
      return res.sendStatus(200);
    }
    return res.sendStatus(404);
  });

  return router;
};
