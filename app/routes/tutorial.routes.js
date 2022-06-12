module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");

    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", tutorials.create);
  
    // Retrieve all Tutorials
    router.get("/", tutorials.findAll);

    // Retrieve all Guidelines
    router.get("/guidelines", tutorials.findGuidelines)

    // Retrieve Specifice Guideline
    router.get("/guideline", tutorials.getGuideline)
  
    // Retrieve all published Tutorials
    router.get("/unpublished", tutorials.findAllUnPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/single/:id", tutorials.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", tutorials.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", tutorials.delete);
  
    // Create a new Tutorial
    router.delete("/", tutorials.deleteAll);

    //Retrieve All Pre-reqs
    router.get("/prereqs", tutorials.allPrereqs )

    //Retrieve All Supports-Off
    router.get("/supportOf", tutorials.allSupports )

    app.use('/api/tutorials', router);
  };