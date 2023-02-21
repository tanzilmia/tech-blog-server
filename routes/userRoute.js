const express = require("express");
const { default: mongoose } = require("mongoose");
const userroute = express.Router();
const createpost = require("../Scemma/createPost");
const CreatePost = new mongoose.model("CreatePost", createpost);
const userscema = require("../Scemma/userInfo");
const User = new mongoose.model("User", userscema);



userroute.get("/all-author", async (req, res) => {
  try {
    User.find({role:"author"}, (err, data) => {
      if (err) {
        res.status(401).send({ message: "data Not Found" });
      } else {
        res.send(data);
      }
    });
  } catch (e) {}
});


userroute.get("/posts", async(req,res)=>{
  try{
      const limit = 6; // number of posts to retrieve in a single page
      const page = req.query.page || 1; // current page (default: 1)
      const offset = (page - 1) * limit; // offset to skip posts in previous pages
      const posts = await CreatePost.find().skip(offset).sort({ date: -1 }).limit(limit);
      const count = await CreatePost.countDocuments();

      res.send({
          posts,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page)
      });
  } catch(e) {
      res.status(500).send({ message: "Internal server error" });
  }
});


userroute.get("/featured-posts", async(req,res)=>{
  try{
    const post = await CreatePost.findOne({ featuresPost: true })
    .sort({ featuredTime: 'asc' })
      .limit(1)
      .exec();

    if(post){
      res.send(post);
    }else{
      res.status(404).send({message:"Post not found"});
    }
  } catch(error){
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
})



userroute.get("/sidepost", async(req,res)=>{
  try{
    const post = await CreatePost.find({})
    .sort({ date: -1 })
      .limit(4)
      .exec();

    if(post){
      res.send(post);
    }else{
      res.status(404).send({message:"Post not found"});
    }
  } catch(error){
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
})





// get unique categorys single post
userroute.get('/unique-posts', async (req, res) => {
    try {
        const uniqueCategories = await CreatePost.aggregate([
          { $sort: { date: -1 } },
          { $group: { _id: "$category", document: { $first: "$$ROOT" } } },
          { $replaceRoot: { newRoot: "$document" } }
        ]);
    
        res.send(uniqueCategories);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });

// get single post

userroute.get('/single-post/:id', async (req, res) => {
    try {
        const singlePost = await CreatePost.findOne({_id:req.params.id})
        res.send(singlePost)
          
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });

//   each category data  

userroute.get('/related-post', async (req, res) => {
  try {
      const category = req.query.category;
      const posts = await CreatePost.find({category:category}).sort({date: -1}).limit(4);
      res.send(posts);
  } catch (err) {
      res.status(500).json({ message: err.message }); 
  }
});



module.exports = userroute;