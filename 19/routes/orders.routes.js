module.exports = app => {
    const faculties = require("../controllers/orders.controller.js");
    let router = require("express").Router();
    
    router.get("/", faculties.getAll);
    router.post("/", faculties.create);
    router.put("/", faculties.update);
    router.delete("/:xyz", faculties.delete);
  
    app.use('/api/orders', router);
};