const { Router } = require("express");
const { loginRequired } = require("../helpers/users");
const { addMap, deleteMap, updateMap, getMap } = require("../helpers/maps");

module.exports = () => {
  const router = Router();

  router.post("/", loginRequired, async (req, res) => {
    res.send(await addMap(req.body, req.user.id));
  });

  router.delete("/", loginRequired, async (req, res) => {
    const deleted = await deleteMap(req.query.map_id, req.user.id);
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
    const map = await getMap();
    if (map) {
      return res.send(map);
    }
    return res.sendStatus(404);
  });

  return router;
};
