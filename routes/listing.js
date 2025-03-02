const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")




//*************index route to display all listings ->  /listing
router.get("/",
    wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({}); 
    res.render("listings/index.ejs",{allListings});

}));

//******** */ /get ->/listing/new -> html form -> submit button -> post ->listings
router.get("/new",isLoggedIn,(req,res)=>{    
   
    res.render("listings/new.ejs")
})

// ********show route****** -> /listing/id ->all data specific to that listing
router.get("/:id",
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exists!")
        res.redirect("/listings")
    }
    console.log(listing);
    
    res.render("listings/show.ejs",{listing});

}));



//create route
router.post(
    "/",
    validateListing,
    wrapAsync(async(req,res,next)=>{
        // let {title,description,image,price,location,country}=req.body;
        const newListing= new Listing(req.body.listing); 
        console.log(req.user);
        
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created Successfully!")
        res.redirect("/listings");  
    })
);


//edit and update route

//edit route-> GET /listings/:id/edit form -> submit
//put route ->PUT /listing/:id

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
        let {id}=req.params;
        const listing= await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you requested for does not exists!")
            res.redirect("/listings")
        }
        res.render("listings/edit.ejs",{listing});

}));

//update route
//put route ->PUT /listing/:id
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async(req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","Listing Updated Successfully!")
        res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully!")
    res.redirect("/listings")
}));

module.exports=router;
