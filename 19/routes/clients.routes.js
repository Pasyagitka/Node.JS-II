module.exports = app => {
    const teachers = require("../controllers/clients.controller.js");
    let router = require("express").Router();
  
    router.get("/", teachers.findAll);
    router.post("/", teachers.create);
    router.put("/", teachers.update);
    router.delete("/:xyz", teachers.delete);

    app.use('/api/clients', router);
  };