const express = require("express");
const { default: mongoose } = require("mongoose");
const authenticaton = express.Router();
const bcrypt = require("bcrypt");
const jwt =  require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scemma/userInfo");
const User = new mongoose.model("User", userscema);


// defining register 

authenticaton.post("/", async(req,res)=>{
   try{
    const userinfo = req.body;
    const {name,email,password} = userinfo
    const enryptedpass =  await bcrypt.hash(password, 10)
    const alreayExist = await User.findOne({email:email})
    if(alreayExist){
        res.send({message: "User Is Alreay Exist"})
    }else{
        const user = new User({
            name,
            email,
            password:enryptedpass
        })

        user.save((err)=>{
            if(err){
                res.send(err)
            }else{
                res.send({message:"Register SuccessFull"})
            }
        })
    }

   }catch(e){}

})

authenticaton.post("/login", async(req,res)=>{
    try{
     const userinfo = req.body;
     const {email,password} = userinfo;
     const validuser = await User.findOne({email:email});
     const validPass = await bcrypt.compare(password, validuser.password)
     if(validuser){
         if(validPass){
             const token = jwt.sign({email:validuser.email},`${process.env.JWT_SECRET}`)
             console.log("password is valid");
             res.status(200).send({message:"Login Successful", data: token});
             console.log("successfull")
         }else{
             res.send({message:"password not Match"})
         }
     }else{
         res.send({message:"user not Valid"})
     }
 
 
    }catch(e) {}
 })
 


module.exports = authenticaton