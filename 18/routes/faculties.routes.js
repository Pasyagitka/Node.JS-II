module.exports = app => {
    const faculties = require("../controllers/faculties.controller.js");
  
    let router = require("express").Router();
    
    router.get("/", faculties.getAll);
    router.get("/:xyz/pulpits", faculties.getPulpits); //todo decodeURI, regex
    router.get("/:xyz/teachers", faculties.getTeachers); 

    router.post("/", faculties.create);
    router.put("/", faculties.update);
    router.delete("/:xyz", faculties.delete);
  
    app.use('/api/faculties', router);
};