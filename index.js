const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const userAuth = require("./routes/loginRoutes")

// middleware
app.use(cors());
app.use(express.json());

const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nz3kcdw.mongodb.net/TechBlog?retryWrites=true&w=majority`;
// conncet with mongodb
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connceted mongoose");
  })
  .catch((e) => console.log(e));

// user authentication 

app.use("/authentication", userAuth )




// testing
app.get("/", (req, res) => {
  res.send("Blog Website is running");
});
app.listen(port, () => {
  console.log(`Blog Website on port ${port}`);
});
