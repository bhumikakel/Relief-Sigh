const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Listing=require("../models/listing.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body, {abortEarly: false })
        console.log(error);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
}


//*************index route to display all listings ->  /listing
router.get("/",
    wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({}); 
    res.render("listings/index.ejs",{allListings});

}));

//******** */ /get ->/listing/new -> html form -> submit button -> post ->listings
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// ********show route****** -> /listing/id ->all data specific to that listing
router.get("/:id",
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

}));



//create route
router.post(
    "/",
    validateListing,
    wrapAsync(async(req,res,next)=>{
        // let {title,description,image,price,location,country}=req.body;
        const newListing= new Listing(req.body.listing); 
        await newListing.save();
        res.redirect("/listings");  
    })
);


//edit and update route

//edit route-> GET /listings/:id/edit form -> submit
//put route ->PUT /listing/:id

router.get("/:id/edit",
    
    wrapAsync(async(req,res)=>{
        let {id}=req.params;
        const listing= await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});

}));

//update route
//put route ->PUT /listing/:id
router.put("/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        res.redirect("/listings");
}));


//delete route
router.delete("/:id",
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));

module.exports=router;
