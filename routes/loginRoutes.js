const express = require("express");
const { default: mongoose } = require("mongoose");
const authenticaton = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userscema = require("../Scemma/userInfo");
const User = new mongoose.model("User", userscema);
authenticaton.use(express.json());

// defining register

authenticaton.post("/", async (req, res) => {
  try {
    const userinfo = req.body;
    const { name, email, password,porfilepic,role } = userinfo;
    const enryptedpass = await bcrypt.hash(password, 10);
    const alreayExist = await User.findOne({ email: email });
    if (alreayExist) {
      res.send({ message: "User Is Alreay Exist" });
    } else {
      const user = new User({
        name,
        email,
        password: enryptedpass,
        porfilepic,
        role
      });

      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Register SuccessFull" });
        }
      });
    }
  } catch (e) {
    res.send({message: "custome error"})
  }
});

authenticaton.post("/login", async (req, res) => {
  try {
    const userinfo = req.body;
    const { email, password } = userinfo;
    const validuser = await User.findOne({ email: email });
    const validPass = await bcrypt.compare(password, validuser.password);
    if (validuser) {
      if (validPass) {
        const token = jwt.sign(
          { email: validuser.email },
          `${process.env.JWT_SECRET}`
        );
        res.status(200).send({ message: "Login Successful", data: token });
        
      } else {
        res.send({ message: "password not Match" });
      }
    } else {
      res.send({ message: "user not Valid" });
    }
  } catch (e) {
    res.send({message: "custome error"})
  }
});

authenticaton.post("/user-info", async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.JWT_SECRET)
    const userEmail = user.email;
    const userdata = await User.findOne({email:userEmail})
    if(userdata){
        res.status(200).send({ message: "successfull", data: userdata });
    }else{
        res.status(400).send({message: "Not Valid User"})
    }


  } catch (e) {}
});

authenticaton.put("/upload-profile", async (req, res) => {
  try {
    const id =  req.query.id;
    const {profile} = req.body;
    await User.updateOne({_id:id}, {
      $set:{
        porfilepic:profile
      }
     },
     async(err, data)=>{
      if(err){
        res.send({message: "update failed"})
      } else{
        const user = await User.findOne({_id:id})
        res.send({message:"update complete", data:user})
      }
     }
     
     )
    
    
   
  } catch (err) {
  
  }
});




module.exports = authenticaton;
