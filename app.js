const express=require("express");
const app=express();
const mongoose=require("mongoose");

const MONGO_URL='mongodb://127.0.0.1:27017/Homify'

const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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


//*************index route to display all listings ->  /listing
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({}); 
    res.render("listings/index.ejs",{allListings});

})

//******** */ /get ->/listing/new -> html form -> submit button -> post ->listings
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// ********show route****** -> /listing/id ->all data specific to that listing
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

})



//create route
app.post("/listings",async(req,res)=>{
    // let {title,description,image,price,location,country}=req.body;
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");    
});


//edit and update route

//edit route-> GET /listings/:id/edit form -> submit
//put route ->PUT /listing/:id

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})

});

//update route
//put route ->PUT /listing/:id
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
})


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

app.get("/",(req,res)=>{
    res.send("Hello @ Airbnb");
    
})



app.listen(8080,()=>{
    console.log("Server is working on 8080...");
    
});