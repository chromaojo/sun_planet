const express = require('express');
const route = express.Router();
const path = require("path");
const { AvoidIndex, UserLoggin} = require('../auth/auth');




// Home Page 
route.get('/', AvoidIndex, (req, res) => {


    res.sendFile(path.join(__dirname, "../../statics", 'index.html'));
})


// To register a new account 
route.get('/register', (req, res) => {


    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    if (!userCookie) {
        res.sendFile(path.join(__dirname, "../../statics", 'signUp.html'));

    } else {

        res.redirect('/login');
    }
})

// Register new Users 


route.get('/login', AvoidIndex, (req, res) => {
    
    res.sendFile(path.join(__dirname, "../../statics", 'login.html'));
})







module.exports = route;