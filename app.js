//jshint esversion:6
require('dotenv').config();
const express= require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose =require("mongoose");
const md5 = require("md5");
const app = express();



app.use(express.static("public"));
app.set('view engine' ,'ejs');
app.use(bodyParser.urlencoded({extended:true}));
// Conneting with mongodb database
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});
// Creating userDB  Schema
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


// Creating userDB Model
const User = mongoose.model("User",userSchema);

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne( {email : username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password ===password){
          res.render("secrets");
        }
      }
    }
  });
});

app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});


app.listen(3000,function(req,res){
  console.log("You are on port:3000");
});
