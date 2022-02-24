module.exports = app => {
    const subjects = require("../controllers/redactors.controller.js");
    let router = require("express").Router();
  
    router.get("/", subjects.findAll);

    app.use('/api/redactors', router);
  };