module.exports = app => {
    const types = require("../controllers/auditoriumtypes.controller.js");
    let router = require("express").Router();
  
    router.get("/", types.findAll);
    router.post("/", types.create);
    router.put("/", types.update);
    router.delete("/:xyz", types.delete);

    app.use('/api/auditoriumtypes', router);
  };