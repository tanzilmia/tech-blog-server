const mongoose = require("mongoose")
const settingsScema = new mongoose.Schema({
    category : Array
})
module.exports = settingsScema