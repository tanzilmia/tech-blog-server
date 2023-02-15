const mongoose = require("mongoose");
const CreatePost = new mongoose.Schema({
      title:String,
      article:String,
      date:String,
      category:String,
      email:String,
      name:String,
      thumbnail:String,
      like: Number,
      featuresPost: Boolean
})

module.exports = CreatePost