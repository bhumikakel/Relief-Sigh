const express=require("express");
const app=express();
const mongoose=require("mongoose");


const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js")


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

// const {reviewSchema}=require("../schema.js")

const MONGO_URL='mongodb://127.0.0.1:27017/Homify';



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






app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)


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