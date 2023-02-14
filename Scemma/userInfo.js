const mongoose = require("mongoose")
const UserScemas = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    porfilepic:String,
    role:String,
})

module.exports = UserScemas;

