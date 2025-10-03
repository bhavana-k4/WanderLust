const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage});

//Index Route
// router.get("/", wrapAsync(listingController.index))
// router.post("/",isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing));
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"), // Multer middleware for file upload
        validateListing,
        wrapAsync(listingController.createListing)
    );

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);
     //here,isLoggedIn is a middleware which we have created and required at starting..

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/",isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports = router;
