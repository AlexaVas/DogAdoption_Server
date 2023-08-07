/** @format */

const router = require("express").Router();
const fileUploader = require("../config/couldinary.config")
const mongoose = require("mongoose");
const libphonenumber = require("google-libphonenumber");
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();


const Shelter = require("../models/Shelter.model");
const Dog = require("../models/Dog.model");
const {isAuthenticated} = require("../middleware/jwt.middleware.js");




//////  POST /shelter/profile  -  Creates a new dog////////////////////////

router.post("/profile", fileUploader.array("image", 5), (req, res) => {
  try{


      // if (req.fileValidationError) {
      //   return res
      //     .status(400)
      //     .json({
      //       message:
      //         req.fileValidationError.message +
      //         " Only up to 5 pictures are allowed!",
      //     });
      // } else if (!req.files) {
      //   return res
      //     .status(400)
      //     .json({
      //       message:
      //         req.message +
      //         " Problem uploading the pictures, only png and jpg formats are allowed.",
      //     })};
      
    const {
      name,
      breed,
      age,
      phone,
      description,
      profileId,
      shelterName,
      shelterLocation,
    } = req.body;
      
    try {
    
     console.log("Uploaded File Information:", req.files);

     
       const phoneNumber = phoneUtil.parseAndKeepRawInput(
         phone,
         "INTERNATIONAL"
       );
       const isValid = phoneUtil.isValidNumber(phoneNumber);
       if (!isValid) {
         res.status(400).json({
           message: `${phone} is not a correct phone number.`,
         });
         return;
       }
     } catch (error) {
       // The `parseAndKeepRawInput` function can throw an error for invalid input
       res.status(400).json({
         message: `${phone} is not a correct phone number.`,
       });
       return;
     }



     
     /////IMAGE UPLOAD////////
     let imageUrl = [];
      const urls = req.files;

      if (!urls) {
       res.status(400).json({ message: "Only up to 5 pictures are allowed!" });
       return;
     }
    
      urls.forEach((item) => {
       imageUrl = [...imageUrl, item.path];
     });

      console.log(urls);

    
     //////////////////////////

    Dog.create({
      name,
      breed,
      age,
      phone,
      image: imageUrl,
      description,
      shelter: profileId,
      shelterName,
      location: shelterLocation,
    }).then((newDog) => {
      return Shelter.findByIdAndUpdate(profileId, {
        $push: { dogs: newDog._id },
        new: true,
      })
        .then((resp) => res.status(200).json(resp))
        .catch((err) => res.json(err));
    });

      } catch (error) {
       // The `parseAndKeepRawInput` function can throw an error for invalid input
       res.status(400).json({
         message: "Only up to 5 pictures are allowed!",
       });}

      }
);
  


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

router.put(
  "/listings/:dogId",
  isAuthenticated,
  fileUploader.array("image", 5),
  (req, res, next) => {
    const { dogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dogId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    
    /////IMAGE UPLOAD////////
    let imageUrl = [];
    const urls = req.files;

    
    urls.forEach((item) => {
      imageUrl = [...imageUrl, item.path];
    });

    console.log(urls);

    const newImageArray = imageUrl.length > 0 ? imageUrl : false;

    //////////////////////////

    const updatedDogData = {
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      phone: req.body.phone,
      description: req.body.description,
      image: newImageArray || req.body.image,
    };

    Dog.findByIdAndUpdate(dogId, updatedDogData, { new: true })
      .then((updatedDog) => res.status(200).json(updatedDog))
      .catch((error) => res.json(error));
  }
);




 
 
module.exports = router;