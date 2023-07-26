/** @format */

const router = require("express").Router();

const mongoose = require("mongoose");

const Dog = require("../models/Dog.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");



router.get("/dog-list", isAuthenticated, (req, res, next) => {
  Dog.find()
    .then((alldogs) => res.json(alldogs))
    .catch((err) => res.json(err));
});


router.post("/dog-list/:dogId", isAuthenticated, (req, res, next) => {
  const { dogId } = req.params;
  const userId = req.payload._id;

  User.findOne({ _id: userId, favorites: dogId })
  
  .then((dogFound) => {
    // If the user with the same email already exists, send an error response
    if (dogFound) {
      return res.status(400).json({ error: "Dog already in favorites." });
    } else{ 
      
      Promise.all([

    User.findByIdAndUpdate(
      userId,
      { $push: { favorites: dogId } },
      { new: true }
    ),
    Dog.findByIdAndUpdate(dogId, { $push: { user: userId } }, { new: true }),
  ])
    .then(([updatedUser, updatedDog]) => {
      console.log(
        `A dog has been successfully added to favorites: ${updatedUser}`
      );
      res.json({ message: "Dog added to favorites successfully." });
    })
      .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong." });
    });
  }})

    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong." });
    });



});

     


router.get("/profile", isAuthenticated, (req, res, next) => {

  const userId = req.payload._id;

  User.findById(userId)
    .populate("favorites")
    .then((alldogs) => res.json(alldogs.favorites))
    .catch((err) => res.json(err));
});


router.delete("/profile/:dogId", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  const { dogId } = req.params;

  Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: dogId } },
      { new: true }
    ),
    Dog.findByIdAndUpdate(dogId, { $pull: { user: userId } }, { new: true }),
  ])
    
  .then(([updatedUser, updatedDog]) => {
      console.log(
        `A dog has been removed from favorites: ${updatedUser.favorites}`
      );
      res.json({ message: `Dog removed from favorites. =>  ${updatedUser.favorites} ` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong." });
    });
});



 




module.exports = router;




// const router = require("express").Router();
// // const mongoose = require("mongoose");

// const Task = require("../models/Task.model");
// const Project = require("../models/Project.model");

// //  POST /api/tasks  -  Creates a new task
// router.post("/tasks", (req, res, next) => {
//   const { title, description, projectId } = req.body;

//   Task.create({ title, description, project: projectId })
//     .then((newTask) => {
//       return Project.findByIdAndUpdate(projectId, {
//         $push: { tasks: newTask._id },
//       });
//     })
//     .then((response) => res.json(response))
//     .catch((err) => res.json(err));
// });

// module.exports = router;
