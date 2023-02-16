const express = require("express");
const { default: mongoose } = require("mongoose");
const adminRoute = express.Router();
const settingsScema = require("../Scemma/Settting");
const categoryScema = require("../Scemma/addCategory");
const Setting = new mongoose.model("Setting", settingsScema);
const Category = new mongoose.model("Category", categoryScema);
const createpost = require("../Scemma/createPost");
const CreatePost = new mongoose.model("CreatePost", createpost);
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userscema = require("../Scemma/userInfo");
const User = new mongoose.model("User", userscema);

// verify Admin Access
const verifyToken = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(403).send({ message: "UnAuthrize Access" });
      }
      if (authorization) {
        const token = authorization.split(" ")[1];
        const decoded = await jwt.verify(token, `${process.env.JWT_SECRET}`);
        const { email } = decoded;
        console.log(req.query.email);
        if (email === req.query.email) {
          next();
        } else {
          return res.status(403).send({ message: "UnAuthrize" });
        }
      }
    } catch (err) {
      return next("Privet Api");
    }
  };
  

// delete post

adminRoute.delete("/delete-post", verifyToken, async (req, res) => {
  res.send({ message: `${req.query.id}` });
});

// add category
adminRoute.post("/add-category", verifyToken, async (req, res) => {
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

// get categories
adminRoute.get("/categories", async (req, res) => {
  try {
    Category.find({}, (err, data) => {
      if (err) {
        res.status(401).send({ message: "data Not Found" });
      } else {
        res.send(data);
      }
    });
  } catch (e) {}
});
// get all user
adminRoute.get("/all-user", verifyToken, async (req, res) => {
  try {
    User.find({}, (err, data) => {
      if (err) {
        res.status(401).send({ message: "data Not Found" });
      } else {
        res.send(data);
      }
    });
  } catch (e) {}
});
// get all posts
adminRoute.get("/all-posts", verifyToken, async (req, res) => {
  try {
    CreatePost.find({}, (err, data) => {
      if (err) {
        res.status(401).send({ message: "data Not Found" });
      } else {
        res.send(data);
      }
    });
  } catch (e) {}
});

adminRoute.put("/make-user", verifyToken, async (req, res) => {
  try {
    const {id} = req.body;
    await User.updateOne(
      { _id: id },
      {
        $set: {
          role: "null",
        },
      }
    );
    const updateuser = await User.find({});
    res.send(updateuser);
  } catch (e) {
    res.send({ message: e.message });
  }
});


adminRoute.put("/make-autor", verifyToken, async (req, res) => {
  try {
    const {id} = req.body;
    await User.updateOne(
      { _id: id },
      {
        $set: {
          role: "author",
        },
      }
    );
    const updateuser = await User.find({});
    res.send(updateuser);
  } catch (e) {
    res.send({ message: e.message });
  }
});



adminRoute.delete("/delete-user", verifyToken, async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.query.id });
    if (result.deletedCount === 1) {
      const updateUser = await User.find({});
      res.send(updateUser);
    } else {
      res.send({ message: "Not Success Delete History" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
});

module.exports = adminRoute;
