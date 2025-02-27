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






const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');  // Import bcrypt
const User = require('./models/User.js');
require('dotenv').config();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173/',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),  // Correct variable spelling
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email: email });  // Correct variable spelling
    if (userDoc) {
        res.json('found');
    } else {
        res.json('not found');
    }
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
