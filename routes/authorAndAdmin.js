const express = require("express");
const author = express.Router();
const { default: mongoose } = require("mongoose");
const createpost = require("../Scemma/createPost");
const CreatePost = new mongoose.model("CreatePost", createpost);
const jwt = require("jsonwebtoken");
const userscema = require("../Scemma/userInfo");
const User = new mongoose.model("User", userscema);
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if(!authorization){
      res.status(403).send({ message: "UnAuthrize Access" });
    }
    if (authorization) {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
      const { email } = decoded;
      console.log(req.query.email);
      if (email === req.query.email) {
        next();
      } else {
        res.status(403).send({ message: "UnAuthrize" });
      }
    }
  } catch {
    next("Privet Api");
  }
};

author.post("/create-post", verifyToken, async (req, res) => {
  try {
    const postData = req.body;
    const alreadyExist = await CreatePost.findOne({
      title: postData.title,
      category: postData.category,
    });
    if (alreadyExist) {
      res.send({ message: "Post is Alrady Exist" });
    } else {
      const NewPost = new CreatePost(postData);
      await NewPost.save();
      res.send({ message: "Post created successfully" });
    }
  } catch (e) {
    res.send({ message: "Server Side Error" });
  }
});

// delete post

author.delete("/delete-post", verifyToken, async (req,res)=>{
  try {
    const result = await CreatePost.deleteOne({ _id: req.query.id });
    
    if (result.deletedCount === 1) {
      const updatePosts = await CreatePost.find({email:req.query.email});
      res.send({message:"success", posts:updatePosts});
    } else {
      res.send({ message: "Not Success Delete History" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }

})



author.put("/edite-post", verifyToken, async (req, res) => {
  try {
    const Updatepost = req.body;
    const {
      title,
      article,
      date,
      category,
      thumbnail,
      _id
    }  = Updatepost
    
    await CreatePost.updateOne(
      { _id: _id },
      {
        $set: {
      title:title,
      article:article,
      date:date,
      category:category,
      thumbnail:thumbnail,
        },
      }
    );
    res.send({message:"Update Complete"});
  } catch (e) {
    res.send({ message: e.message });
  }
});


author.get("/my-posts", verifyToken, async (req, res) => {
  try {
    const email = req.query.email;
    const mypost = await CreatePost.find({ email: email })
      .sort({ date: -1 })
      .exec();
    res.send({ message: "success", posts: mypost });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});


// author.get("/my-posts", verifyToken, async (req, res) => {
//     try {
//       const email = req.query.email;
//       const mypost = await CreatePost.find({ email: email });
//       res.send({ message: "success", posts: mypost });
//     } catch (e) {
//       res.send({ message: "data not found" });
//     }
//   });
  
author.get("/edite-post/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const mypost = await CreatePost.findOne({ _id: id });
      res.send({ message: "success", posts: mypost });
    } catch (e) {
      res.send({ message: "data not found" });
    }
  });
  

module.exports = author;
