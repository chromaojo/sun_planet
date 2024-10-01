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
const session = require('express-session');
const { AvoidIndex, UserLoggin} = require('../auth/auth');
const {regNew} = require('../module/accounts')


route.use(
    session({
        secret: `Hidden_Key`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);
route.use('/DxXTWwq', require('../module/payment'));

// Home Page 
route.get('/', AvoidIndex, (req, res) => {


    res.render('home-index', {info, layout: false})
})

// pricing 
route.get('/pricing', AvoidIndex, (req, res) => {


    res.render('home-pricing', {info, layout: false})
})

// Properties Section 

route.get('/properties', AvoidIndex, (req, res) => {
    const sql = `
    SELECT * FROM realEstate.re_property ORDER BY id DESC;
  `;
  const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

      db.query(sql,  (err, results) => {
          if (err) {
              console.log('Login Issues :', err);
              return res.status(500).send('Internal Server Error');
          }
        
          
          if (results) {
              const userProp = results
              const userData = userCookie
              return res.render('home-prop', { userProp, info, layout: false})
          }

      })
    
})

// About Section 
route.get('/about', AvoidIndex, (req, res) => {


    res.render('home-about', {info, layout: false})
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


 route.post('/XDcxXLQ/register', regNew)

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
        
       if (result[0].role === 'client') {
        res.redirect('/user/dashboard');
       } else {
        res.redirect('/admin/dashboard');
       }
    });
});

// Logout route
route.get('/logout', (req, res) => {

    delete userCookie
    req.session.destroy((err) => {
        delete userData
        delete userCookie
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