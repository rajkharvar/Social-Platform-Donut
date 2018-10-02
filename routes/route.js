const express = require('express');
const bodyparser = require('body-parser')
const url = bodyparser.urlencoded({extended:false});
const passport = require('passport');
const user = require('../schema/user.js');
const route = express.Router();
const Bcrypt = require('bcrypt')

// Bcrypt password
const generatePassword = function(password) {
  return Bcrypt.hashSync(password, 10)
}

//get request
route.get('/',function(req,res){
  res.render('all');
})

route.get('/google',passport.authenticate('google',{scope:['profile']}));

route.get('/google/redirect',passport.authenticate('google'),function(req,res){
  res.redirect('/profile/:id');
})

//post request
route.post('/userlogin', url, function(req, res){
  new user({
    "fname": req.body.fname,
    "lname": req.body.lname,
    "email": req.body.email,
    "dob": req.body.dob,
    "github": req.body.github,
    "username": req.body.username,
    "pass": generatePassword(req.body.pass),
    "follower": 0,
    "following": 0,
    "status": 'idle',
    "Eid": Math.floor(Math.random()*1000000)
  })
  .save()
  .then(function(user){
    res.render('user', { user });
  })
});

route.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})

module.exports = route;
