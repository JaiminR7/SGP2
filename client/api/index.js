// const express=require('express');
// const app=express();
// const cors=require('cors');
// const mongoose=require("mongoose");
// const User=require('./models/User.js');
// const bcryptSalt = bcrypt.genSaltSync(10);

// require('dotenv').config();
// app.use(express.json());
// app.use(cors({
//     credentials:true,
//     origin:'http://localhost:5173/',
// }));

// mongoose.connect(process.env.MONGO_URL);
// app.get('/test',(req , res)=>{
//     res.json('test ok');
// });
// app.post('/register',async(req,res)=>{
// try{
//     const {name,email,password}=req.body;
//     const userDoc=await User.create({
//         name,
//         email,
//         password:bycrpt.hashSync(password,bycrptSalt),
//     })
//     res.json(userDoc);
// }
// catch(e){
//     res.status(422).json(e);
// }

// })

// app.post('/login',async (req,res)=>{
//     const{email,password}=req.body;
//     const UserDoc =await User.findOne({email:email});
//     if(userDoc)
//     {
//         res.json('found');
//     }
//     else{
//         res.json('not found');
//     }
// })

// app.listen(4000);
// //4rnSjU3xjQOjyNld

const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Import bcrypt
const User = require("./models/User.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();

mongoose.set("strictQuery", true); //added by chatgpt

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "mnbvcxzasdfghjklpoiuytrewq";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// mongoose.connect(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
//new added

app.get("/test", (req, res) => {
  res.json("test ok");
});

//register modified
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(409).json("User already exists");
    }

    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    console.log("User registered successfully:", userDoc);
    res.json(userDoc);
  } catch (e) {
    console.error("Error during registration:", e);

    res.status(500).json("Registration failed. Please try again later");
  }
});
//modified login logic
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json("Please enter both email and password.");
    }

    const userDoc = await User.findOne({ email: email });

    // If user is found
    if (userDoc) {
      // Compare the provided password with the hashed password in the database
      const passOK = bcrypt.compareSync(password, userDoc.password);

      // If password is correct
      if (passOK) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {}, // empty options object
          (err, token) => {
            if (err) throw err;
            // Send token as a cookie along with user data in JSON response
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        // Password is incorrect
        res.status(422).json("Invalid password. Please try again.");
      }
    } else {
      // User not found
      res.status(404).json("User not found. Please register.");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json("Login failed. Please try again later.");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
//4rnSjU3xjQOjyNld
