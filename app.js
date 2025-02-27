const express=require("express");
const app=express();
const mongoose=require("mongoose");

const MONGO_URL='mongodb://127.0.0.1:27017/Homify';

const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


app.engine('ejs',ejsMate);

main()
    .then(()=>{
        console.log("Database connected...");
        
    })
    .catch((err)=>{
        console.log(err);
        
    });

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.get("/",(req,res)=>{
    res.send("Hello @ Airbnb");
    
});

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


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body, {abortEarly: false })
        console.log(error);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
}


//*************index route to display all listings ->  /listing
app.get("/listings",
    wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({}); 
    res.render("listings/index.ejs",{allListings});

}));

//******** */ /get ->/listing/new -> html form -> submit button -> post ->listings
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// ********show route****** -> /listing/id ->all data specific to that listing
app.get("/listings/:id",
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

}));



//create route
app.post(
    "/listings",
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

app.get("/listings/:id/edit",
    
    wrapAsync(async(req,res)=>{
        let {id}=req.params;
        const listing= await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});

}));

//update route
//put route ->PUT /listing/:id
app.put("/listings/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        res.redirect("/listings");
}));


//delete route
app.delete("/listings/:id",
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));


/********review Route****** */
// Post route
app.post("/listings/:id/reviews",
    validateReview,
    wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new Review added.....");
    res.redirect(`/listings/${listing._id}`);

}))

//delete route
app.delete("/listings/:id/reviews/:reviewId",
    wrapAsync(
        async(req,res)=>{
            let {id,reviewId}=req.params;
            await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
            await Review.findByIdAndDelete(reviewId);

            res.redirect(`/listings/${id}`);
        }
    )
)




// app.get("/testListing",async(req,res)=>{
//     let sampleListing= new Listing({
//         title: "my new villa",
//         description: "beachSide Villa",
//         price:20000,
//         location:"Juhu, Mumbai",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample Saved");
//     res.send(sampleListing);
    
// })



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})
//middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(8080,()=>{
    console.log("Server is working on 8080...");
    
});