const express=require("express");
const app=express();
const mongoose=require("mongoose");


const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session");
const flash=require("connect-flash");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

// const {reviewSchema}=require("../schema.js")

const MONGO_URL='mongodb://127.0.0.1:27017/Homify';



app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));



const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions))
app.use(flash());


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




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

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