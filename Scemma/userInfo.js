const mongoose = require("mongoose")
const UserScemas = new mongoose.Schema({
    name: String,
    email:String,
    password:String
})

module.exports = UserScemas;

