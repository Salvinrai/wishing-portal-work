//************---------------------requiremants -----------------------------------************
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { stat, truncate } = require('fs');
const app = express()
const http = require('http').createServer(app)
const path = require('path');
const hbs= require('hbs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const auth = require('./middleware/auth');


// ------------------------------connection to database ------------------------
require('./db/connect');

//-----------------------------models to aquire for schema---------------------
const Register = require("./models/register");


// ------------------------extended requiremnts------------------
const async = require('hbs/lib/async');
const { append, cookie } = require('express/lib/response');

const { json } =require('express');
const { send } = require('process');
const { Console, error } = require('console');



// ----------------------------port local host--------------------
const PORT = process.env.PORT || 4000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
//------------------path finder--------------------------
const static_path =path.join(__dirname,'../public');

const template_path =path.join(__dirname,'../templates/views');

const partial_path =path.join(__dirname,'../templates/partials');


//-----------------------------using express json file 
app.use(express.json());
//cookie parser--
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));

app.use(express.static(__dirname + ''))



//------------------handlebars view engine---------------------------
app.set('view engine','hbs');
app.set('views',template_path);
hbs.registerPartials(partial_path);




// //middleware for authentication # serialization work
// const auth = async (req,res,next) =>{
//   try {

//       //const token = req.cookies.jwt;

//       // const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

//       // const curruser = await Register.findOne({name:verifyUser._id});

//       // req.token = token;
//       // req.curruser = curruser;
//       console.log(curruser);
//       next();
      
      
//   } catch (error) {
    
//      res.render('loginP');
//   }

// }
//-------------------------------------------------------------------------------working module for wishing start here--------------------------
// // ------------------server ------register paths ------------------------------
app.get('/', (req,res)=>{
  res.render('loginP')
});

app.get('/registerP', (req,res)=>{
  res.render('registerP')
});
app.get('/work',auth, (req,res)=>{
  res.render('work')
});
// using auth function for checking seralization
app.get('/index',auth,(req,res)=>{
  // getting data from databse for current user from serializaation work which refer as -- curruser
  const a = req.curruser.date;
  // converting date of birth to month and date and pass to render file through handlebars
  const umonth =a.getMonth();
  const udate =a.getDate();
  res.render('index',{
    name:req.curruser.name,
    iddate:udate,
    idmonth:umonth
  }
  )
});
//-----------------------------------------working module for wishes end here-------------------------------------

// ------------------server ------register paths **end**------------------------------

// creating a new database for registration===> in database
app.post('/register', async(req,res)=>{
  try{
      const RegisterU = new Register({
       name : req.body.name,
       email:req.body.email,
       date : req.body.date,
       password : req.body.password,
      })

      const token =await RegisterU.generateAuthToken();
      console.log('the token part'+ token);
      
      res.cookie('jwt',token,{
        expires:new Date(Date.now()+6000000),
        httpOnly:true
      });

      console.log(cookie);

    const regiatered = await RegisterU.save();
    res.status(201).render('loginP');
  }
  catch(error){
      res.status(400).send(error);

  }
})

// checking patient login--------------> from database ------------------
app.post('/login', async(req,res)=>{
  try{
        const email =req.body.email;
        const password =req.body.password;
   const useremail = await Register.findOne({email:email});

   const isMatch = await bcrypt.compare(password, useremail.password);
   
   const token =await useremail.generateAuthToken();
     console.log('the token part'+ token);
   
     res.cookie('jwt',token,{
       expires:new Date(Date.now()+600000),
       httpOnly:true,
       //secure:true
     });

//kjkhkuh c


   if(isMatch){
       res.status(202).render('work');
      
            
  }
   else{
      res.send("invalid password details");
  
  }
  }   
  catch(error){
    res.status(404).send("invalid login details");
   }
  });

