const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const info = require('../config/info')
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "rEs" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { AvoidIndex, UserLoggin} = require('../auth/auth');




// Home Page 
route.get('/', AvoidIndex, (req, res) => {


    res.render('home-index', {info, layout: false})
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

// Register new User


route.get('/login', AvoidIndex, (req, res) => {
    
    res.sendFile(path.join(__dirname, "../../statics", 'login.html'));
})


// Login route
route.post('/nXcLl/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user and account details with the provided email exists
    const sqlGetUserWithAccount = `
       SELECT 
         u.user_id,
         u.password,
         u.email,
         u.role,
         a.account_id,
         a.total_spent,
         a.account_balance,
         a.phone_number,
         a.surname,
         a.othername,
         a.username,
         a.address,
         a.email as account_email
       FROM realEstate.re_users u
       LEFT JOIN realEstate.re_accounts a ON u.user_id = a.user_id
       WHERE u.email = ?;
     `;
    db.query(sqlGetUserWithAccount, [email], async (error, result) => {
        if (error) {

            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: 'Invalid Email or Password'
            });
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, result[0].password);
        if (!isPasswordValid) {
            // Password is invalid
            return res.status(401).json({
                message: 'Invalid Email or Password'
            });

        }

        // Create a means through which the admin is routed to admin.js 
        // and customer to where they belong 

        req.app.set('userData', result[0])
        let ans = result[0];
        delete ans.password
        const userWithAccount = ans
        

        res.cookie('user', JSON.stringify({ ...userWithAccount }));
        // req.session.userId = result[0].user_id
        res.redirect('/user/dashboard');
    });
});

// Logout route
route.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        delete userData
        res.clearCookie('user');
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/login');
        }
    });
});





module.exports = route;