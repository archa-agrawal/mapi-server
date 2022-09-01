const { Router } = require("express");
const { loginRequired } = require("../helpers/users");
const {
  addMap,
  deleteMap,
  updateMap,
  getMap,
  getMaps,
} = require("../helpers/maps");

module.exports = () => {
  const router = Router();

  router.post("/", loginRequired, async (req, res) => {
    res.send(await addMap(req.body, req.user.id));
  });

  router.delete("/", loginRequired, async (req, res) => {
    const deleted = await deleteMap(req.query.id, req.user.id);
    if (deleted) {
      return res.sendStatus(200);
    }
    return res.sendStatus(404);
  });

  router.put("/", loginRequired, async (req, res) => {
    const updated = await updateMap(req.body, req.user.id);
    if (updated) {
      return res.sendStatus(200);
    }
    return res.sendStatus(404);
  });

  router.get("/", async (req, res) => {
    const map = await getMap(req.query.id, req.user ? req.user.id : null);
    if (map) {
      return res.send(map);
    }
    return res.sendStatus(404);
  });

  router.get("/list", async (req, res) => {
    return res.send(await getMaps(req.user ? req.user.id : null));
  });

  return router;
};
