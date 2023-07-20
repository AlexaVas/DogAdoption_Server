const router = require("express").Router();

const mongoose = require("mongoose");

const Shelter = require("../models/Shelter.model");
const Dog = require("../models/Dog.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");




router.get("/", (req, res, next) => {
 

 Dog.find()
  .then((alldogs) => res.json(alldogs))
  .catch((err) => res.json(err));
});




module.exports = router;
