const router = require("express").Router();

const mongoose = require("mongoose");

const Shelter = require("../models/Shelter.model");
const Dog = require("../models/Dog.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");




router.get("/", (req, res, next) => {
 
  const {limit, page} = req.query;

  let skip = (page - 1)*limit;
   
  console.log(skip);
 Dog.find()
 .skip(skip)
 .limit(limit)
 .exec()
 .then((alldogs) => res.json(alldogs))
  .catch((err) => res.json(err));
});


//////////////////Get Shelter Details/////////



router.get("/shelterdetails/:shelterId",(req,res)=> {

const {shelterId} = req.params;

Shelter.findById(shelterId)
.then((result)=>{res.status(200).json(result)})
.catch((err)=>{
  res.status(500).json({err})
});



})


//////////////////Get Dog Details/////////

router.get("/dogdetails/:dogids", (req, res) => {
  const {dogids} = req.params;

  const dogArray = dogids.split(`,`);

  Dog.find({ _id:{$in: dogArray}})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});



///////////////////////////////////////////





module.exports = router;
