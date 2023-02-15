const express = require("express");
const { default: mongoose } = require("mongoose");
const adminRoute = express.Router();
const settingsScema = require("../Scemma/Settting");
const categoryScema = require("../Scemma/addCategory");
const Setting = new mongoose.model("Setting",settingsScema);
const Category = new mongoose.model("Category",categoryScema);
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userscema = require("../Scemma/userInfo");
const User = new mongoose.model("User", userscema);


// verify Admin Access
const verifyAdmin = (req,res,next)=>{
    try{
        const {authorization} = req.headers
         if(authorization){
            const token = authorization.split(' ')[1]
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) 
            const {email} = decoded
            console.log(req.query.email);
            if(email === req.query.email){
                next()
            }else{
                res.status(403).send({message:"UnAuthrize"})
            }
         }
       
    }catch{
        next("Privet Api")
    }
}



adminRoute.post("/add-category", verifyAdmin, async (req, res) => {
    try {
      const { category } = req.body;
      const alreadyExist = await Category.findOne({ category: category });
      if (alreadyExist) {
        res.send({ message: "This Category Already Exists" });
      } else {
        const newCategory = new Category({ category: category });
        await newCategory.save();
        res.send({ message: "Category created successfully" });
      }
    } catch (err) {
      console.log(err);
      res.send({ message: "Server Side Error" });
    }
  });

adminRoute.get("/categories", async(req,res)=>{
    try{

        Category.find({}, (err,data)=>{
            if(err){
                res.status(401).send({message:"data Not Found"})
            }
            else{
                res.send(data)
            }
        })

    }catch(e){}
})
// get all user
adminRoute.get("/all-user", verifyAdmin, async(req,res)=>{
    try{

      User.find({}, (err,data)=>{
            if(err){
                res.status(401).send({message:"data Not Found"})
            }
            else{
                res.send(data)
            }
        })

    }catch(e){}
})
  

module.exports = adminRoute;