const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");

//*************index route to display all listings ->  /listing
//create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing)
    );


//******** */ /get ->/listing/new -> html form -> submit button -> post ->listings
router.get("/new",isLoggedIn,listingController.renderNewForm)



// ********show route****** -> /listing/id ->all data specific to that listing
//update route
//put route ->PUT /listing/:id
//delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(
            isLoggedIn,
            isOwner,
            wrapAsync(listingController.destroyListing))



//edit and update route

//edit route-> GET /listings/:id/edit form -> submit
//put route ->PUT /listing/:id

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports=router;
