const express = require("express");
const author = express.Router();
const { default: mongoose } = require("mongoose");
const createpost = require("../Scemma/createPost");
const CreatePost = new mongoose.model("CreatePost", createpost);
const jwt = require("jsonwebtoken");
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

author.get("/my-posts", verifyToken, async (req, res) => {
    try {
      const email = req.query.email;
      const mypost = await CreatePost.find({ email: email });
      res.send({ message: "success", posts: mypost });
    } catch (e) {
      res.send({ message: "data not found" });
    }
  });
  

module.exports = author;
