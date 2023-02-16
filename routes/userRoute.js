const express = require("express");
const { default: mongoose } = require("mongoose");
const userroute = express.Router();
const createpost = require("../Scemma/createPost");
const CreatePost = new mongoose.model("CreatePost", createpost);



// get all posts
userroute.get("/posts", async(req,res)=>{
    try{

        CreatePost.find({}, (err,data)=>{
            if(err){
                res.status(401).send({message:"data Not Found"})
            }
            else{
                res.send(data)
            }
        })

    }catch(e){}
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

userroute.get('/posts/:category', async (req, res) => {
    try {
        const posts = await CreatePost.find({category:req.params.category})
        res.send(posts)
          
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });


module.exports = userroute;