module.exports = app => {
    const subjects = require("../controllers/subjects.controller.js");
    let router = require("express").Router();
  
    router.get("/", subjects.findAll);
    router.post("/", subjects.create);
    router.put("/", subjects.update);
    router.delete("/:xyz", subjects.delete);

    app.use('/api/subjects', router);
  };