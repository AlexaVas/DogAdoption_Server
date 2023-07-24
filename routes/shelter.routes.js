/** @format */

const router = require("express").Router();

const mongoose = require("mongoose");

const Shelter = require("../models/Shelter.model");
const Dog = require("../models/Dog.model");
const {isAuthenticated} = require("../middleware/jwt.middleware.js")


//////  POST /shelter/profile  -  Creates a new dog////////////////////////

router.post("/profile", (req, res, next) => {
  const {
    name,
    breed,
    age,
    phone,
    image,
    description,
    profileId,
    shelterName,
    shelterLocation,
  } = req.body;
  Dog.create({
    name,
    breed,
    age,
    phone,
    image,
    description,
    shelter: profileId,
    shelterName,
    location: shelterLocation,
  }).then((newDog) => {
    return Shelter.findByIdAndUpdate(profileId, {
      $push: { dogs: newDog._id },
      new: true,
    })
      .then((resp) => console.log(resp))
      .catch((err) => res.json(err));
  });

});

router.get("/listings", isAuthenticated, (req, res, next) => {

 
  const shelterId = req.payload._id;

  Shelter.findById(shelterId)
    .populate("dogs")
    .then((alldogs) => res.json(alldogs))
    .catch((err) => res.json(err));

});


router.get("/listings/:dogId", isAuthenticated, (req, res, next) => {

  const { dogId } = req.params;

  Dog.findById(dogId)
    .then((alldogs) => {
      console.log(alldogs);
      return res.status(200).json(alldogs)})
    .catch((err) => res.json(err));
});

/////////////////////////////////Delete//////////////////////////

router.delete("/listings/:dogId", isAuthenticated, (req, res, next) => {
  const { dogId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dogId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Dog.findByIdAndRemove(dogId)
    .then(() =>
      res.status(200).json({
        message: `Dog with ${dogId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});


/////////////////////////////////PUT//////////////////////////

router.put("/listings/:dogId", isAuthenticated, (req, res, next) => {

const {dogId} = req.params;

if (!mongoose.Types.ObjectId.isValid(dogId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

    Dog.findByIdAndUpdate(dogId, req.body, { new: true })
      .then((updatedDog) => res.status(200).json(updatedDog))
      .catch((error) => res.json(error));


}
  
);




 
 
module.exports = router;