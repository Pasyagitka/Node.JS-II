module.exports = app => {
    const auditoriums = require("../controllers/auditoriums.controller.js");
    let router = require("express").Router();
  
    router.get("/", auditoriums.findAll);
    router.post("/", auditoriums.create);
    router.put("/", auditoriums.update);
    router.delete("/:xyz", auditoriums.delete);

    router.get("/auditoriumsgt60", auditoriums.auditoriumsgt60);
    router.get("/decrease", auditoriums.decreaseAudCapacity);
    router.get("/read", auditoriums.readDirty);

    app.use('/api/auditoriums', router);
  };