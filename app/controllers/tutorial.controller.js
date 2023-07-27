const { ConnectionStates } = require("mongoose");
const db = require("../models");
const tutorialModel = require("../models/tutorial.model");
const Tutorial = db.tutorials;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return {limit, offset}
}

// Create and Save a new Tutorial
exports.create = (req, res) => {
     // Validate request
  if (!req.body.guideline) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    guideline: req.body.guideline,
    table: req.body.table,
    recommendation: req.body.recommendation,
    class: req.body.class,
    loe: req.body.loe,
    prereq: req.body.prereq,
    published: req.body.published ? req.body.published : false
  });

  // Save Tutorial in the database
  console.log(req.body)
  tutorial
    .save(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database, generate Index And send paginated
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var bladwijzer = [];
    var tutorialList = [];
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    const { limit, offset } = getPagination(page, size);

    Tutorial.find()
    .then (data1 => {
        tutorialList = data1
        createBladwijzer();   
      })
   

    Tutorial.paginate(condition, {offset, limit})
      .then(data => {
        res.send({
          totalItems: data.totalDocs,
          tutorials: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
          bladwijzer: bladwijzer
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });

      function pushGuideline(guideline) {
        return new Promise (resolve => {
          console.log (guideline)
          bladwijzer.push ({"guideline": guideline, "tables": ["Tabel 1"] })
        })}

      async function createBladwijzer () {
        console.log(tutorialList)
        for (i=0; i < tutorialList.length; i++) {
          if (bladwijzer.some(bladwijzer => bladwijzer.guideline === tutorialList[i].guideline)) {
            for (j=0; j<tutorialList[i].tables.length + 1; j++) {
              console.log ("loop door tables")
            }
          } else {
            await pushGuideline (tutorialList[i].guideline)
            }
              console.log("dit is poging 1")
              console.log (bladwijzer.guideline)
          }
        }      
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Tutorial.findById(id)
    .then(data => {
      console.log(data);
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
            });
          } else res.send({ message: "Tutorial was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Tutorial with id=" + id
          });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

  Tutorial.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Get all guidelines
exports.findGuidelines = (req, res) => {
  Tutorial.aggregate([
      {
      $group : {
        _id : "$guideline",
        details: {
          $push : {
            recommendation:"$recommendation",
            id:"$_id"
          }
        }
      }
    },
      {
        $sort: {
          "_id": 1
        }
      },
      
  ])
  .then(data => {
    if (!data)
      res.status(404).send({ message: "Could not retrieve Guidelines "});
    else {
      console.log(data + "hallo")
      res.send({
        data: data
      })
    }})
  .catch(err => {
    console.log(err)
    res
      .status(500)
      .send({ message: "Could not retrieve guidelines"});
  });
  }

// Get guideline
exports.getGuideline = (req, res) => {
  Tutorial.aggregate([
    { $match: { guideline: req.query.guideline}},
      { $group: {
        _id : "$table", 
        details: {
          $push : {
            recommendation:"$recommendation",
            class:"$class",
            loe:"$loe",
            id:"$_id"
          }
        }
      } 
      },
      {
        $sort: {
          "_id": 1
        }
      },
  ]).then(data => {
    if (!data)
      res.status(404).send({ message: "Could not retrieve guideline... "});
    else {
      res.send({
        data: data
      })
    }})
  .catch(err => {
    res
      .status(500)
      .send({ message: "Could not retrieve guideline" + err});
  });
}

// Find all published Tutorials
exports.findAllUnPublished = (req, res) => {
    const {page, size, query} = req.query;
    const { limit, offset } = getPagination(page, size);
    const zoek = JSON.parse(query);
    Tutorial.paginate(zoek, {offset, limit})
    .then(data => {
      res.send({
      totalItems: data.totalDocs,
      tutorials: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1
    })
  })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
  
};
// PreReq sectie
// Get all preReqs
exports.allPrereqs = (req, res) => {
  Tutorial.distinct("prereq")
  .then(data => {
    if (!data)
    res.status(404).send({ message: "Could not retrieve prereqs... "});
    else {
    console.log (data)
    res.send({
      data: data
    })
  }})
  .catch(err => {
  res.status(500).send({ message: "Could not retrieve prereq" + err});
  });
}

//Get all recs with a pre-req
exports.allRecPrereq = (req, res) => {
  const id = req.params.id;
  console.log(id)
  Tutorial.find({
    prereq: { $elemMatch: { key: id} } 
  })
  .then(data=> {
    if(!data)
    res.status(404).send({ message: "Could not retrieve inforomation on prereq... "});
    else {
      res.send({
        data: data, 
      })
    }})
  .catch(err => {
    res.status(500).send({ message: "Could not retrieve prereq" + err});
    });
}

exports.allRecPrereqMin = (req, res) => {
  console.log("works")
  Tutorial.distinct("prereq.key")
    .then(data => {
      if (!data)
      res.status(404).send({ message: "Could not retrieve PreReqs... "});
      else {
      console.log (data)
      res.send({
        data: data
      })
    }})
    .catch(err => {
    res.status(500).send({ message: "Could not retrieve PreReqs" + err});
    });
}

// Get all supports
exports.allSupports = (req, res) => {
  Tutorial.aggregate([
    {$unwind: "$supportOf"},
      {$group : {
        _id: "$supportOf",
        details: {
          $push : {
            recommendation:"$recommendation",
            rec_id:"$_id"
          }}
      }}
  ])
  .then(data => {
    if (!data)
    res.status(404).send({ message: "Could not retrieve supports... "});
    else {
    res.send({
      data: data
    })
  }})
  .catch(err => {
  res.status(500).send({ message: "Could not retrieve supports" + err});
  });
}

exports.allSupportsMin = (req, res) => {
  Tutorial.distinct("supportOf.value")
  .then(data => {
    if (!data)
    res.status(404).send({ message: "Could not retrieve supports... "});
    else {
    res.send({
      data: data
    })
  }})
  .catch(err => {
  res.status(500).send({ message: "Could not retrieve supports" + err});
  });
}

exports.allSupportsMinType = (req, res) => {
  Tutorial.distinct("supportOf.type")
  .then(data => {
    if (!data)
    res.status(404).send({ message: "Could not retrieve supportTypes... "});
    else {
    res.send({
      data: data
    })
  }})
  .catch(err => {
  res.status(500).send({ message: "Could not retrieve supportTypes" + err});
  });
}