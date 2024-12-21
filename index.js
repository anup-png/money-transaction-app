const express = require("express");
const cors =require("cors");
const mongoose = require('mongoose');




const app= express();

app.use(cors());
app.use(express.json());
const mainRouter = require("./routes/index");

app.use("/api/v1",mainRouter); //any request coming at /api/v1 will be redirected to mainRouter.mainRouter will handle the request further

app.listen(3000,()=>{
    console.log("Server is running at port 3000");
});
// mongoose.connect("mongodb+srv://anupRaj:54w742WRw2U36Qkv@cluster0.maqxzmb.mongodb.net/myPaytm");



