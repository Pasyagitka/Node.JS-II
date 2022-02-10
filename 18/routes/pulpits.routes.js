module.exports = app => {
    const pulpits = require("../controllers/pulpits.controller.js");
    let router = require("express").Router();
  
    router.get("/", pulpits.findAll);
    router.post("/", pulpits.create);
    router.put("/", pulpits.update);
    router.delete("/:xyz", pulpits.delete);

    app.use('/api/pulpits', router);
  };