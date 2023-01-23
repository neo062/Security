//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// Conneting with mongodb database
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true
});

// Creating userDB  Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


// Creating userDB Model
const User = mongoose.model("User", userSchema);

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
});


app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {

        bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
          // result == true
          if (result === true) {
            res.render("secrets");
          }
        });

      }
    }
  });
});

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.get("/login", function(req, res) {
  res.render("login");
});


app.listen(3000, function(req, res) {
  console.log("You are on port:3000");
});
