module.exports = app => {
    const types = require("../controllers/producttypes.controller.js");
    let router = require("express").Router();
  
    router.get("/", types.findAll);

    app.use('/api/producttypes', router);
  };