const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { UserLoggin } = require('../auth/auth');
const { allMyLead, allLead, oneLead, createLead } = require('../module/lead');
const { allProp, oneProp, createProp } = require('../module/property');
const { allMyComplain, allComplain, createComplain } = require('../module/complaint');
const { allMyRept, allRept, oneRept, deleteRept } = require('../module/report');
const { allSaved, oneSaved, createSaved, deleteSaved } = require('../module/saved');
const { allInvest, oneInvest, createInvest } = require('../module/investment');
let random = Math.floor(Math.random() * 999999999 / 1.9);
let rando = Math.floor(Math.random() * 99999);
const rand = rando + "rEs" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');




route.use(
    session({
        secret: `Hidden_Key`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);


route.use(express.json())
route.use(express.urlencoded({ extended: true }));




// See All Properties 

route.get('/dashboard', allProp, (req, res) => {

});





// To Read One Property detail 
route.get('/property-zZkKqQP/:id', oneProp, (req, res) => {


});


// To gat Create Property
route.get('/transactions', (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = userCookie.user_id
    const sql = `
    SELECT * FROM sun_planet.spc_transaction WHERE user_id = ? ORDER BY transaction_id DESC;
  `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Login Issues :', err);
            return res.status(500).send('Internal Server Error');
        }


        if (results) {

            const userTran = results

            const userData = userCookie
            return res.render('transaction', { userData, userTran })

        }

    })

});



// To Read All Investments 
route.get('/investments', allInvest, (req, res) => {

});

// To Read One Investment detail 
route.get('/invest/:id', oneInvest, (req, res) => {

    res.send('Route is okay')
});



// User profile section
route.get('/profile', UserLoggin, (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData
    console.log('Here is my Dashboard Data', userCookie);
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const user = db.query('SELECT * FROM sun_planet.spc_users WHERE email = ?', [userData.email], async (error, result) => {

            // console.log('This is the dashboard Details : ', userData);
            if (error) {
                console.log(" Login Error :", error);
                return res.redirect('/user/logout');
            }
            if (result) {
                res.render('profile', { userData, });
            }

        })
    }
});


// To Get all the saved Property details
route.get('/save/:id', createSaved, (req, res) => {

    res.redirect('/user/saved')
});


// To Get all the saved Property details
route.get('/delet/:id', deleteSaved, (req, res) => {

    res.redirect('/user/saved')
});

// To Get all my Report details
route.get('/my-report', allMyRept, (req, res) => {

});

// To Get all my Report details
route.get('/reeport/:report_id', oneRept, (req, res) => {

});

// To Get all my Report details
route.get('/delRep/:report_id', deleteRept, (req, res) => {
    res.redirect('/user/my-report')
});


// To Get all my saved Property details
route.get('/saved', allSaved, (req, res) => {


});

// To get the editing Page  
route.use('/edit', require('../routes/edit'));


// To Get all my saved Property details
route.get('/complaints', allMyComplain, (req, res) => {
});

// To Get all my saved Property details
route.post('/complaints/xXPpRyds', createComplain, (req, res) => {


});

// To Get all saved Property details
route.get('/mYlead', allLead, (req, res) => {


});

// To Get all my saved Property details
route.get('/mYlead/wWwCcYtT', allMyLead, (req, res) => {


});

route.get('/vVxYLead/:id', oneLead, (req, res) => {


});


// To Get all my saved Property details
route.post('/lead/KxkRTtyZx', createLead, (req, res) => {
    res.redirect('/user/mYlead/wWwCcYtT')

});



// Logout route
route.get('/logout', (req, res) => {

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