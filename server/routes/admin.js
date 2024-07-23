const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
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



// To get all the users for the admin
route.get('/users', UserLoggin, (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    const userId = req.params.userId;
    

    const sql = `
      SELECT * FROM fasttrac.users;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error retrieving shipments:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userAll');
        req.app.set('userAll', results)
        // res.json(results);
        const userAll = req.app.get('userAll');
        console.log("All Admin user detail is", userAll)
        res.render('user', { userData, userAll })
    });
});



// To get each user detail 
route.get('/users/:userId', UserLoggin, (req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = req.params.userId;

    // Retrieve user data from the database based on userId
    const sql = `
      SELECT * FROM fasttrac.users WHERE user_id = ?;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error retrieving user data:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Check if user exists
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.clearCookie('userOne');
        req.app.set('userOne', results)
        // res.json(results);
        const userOne = req.app.get('userOne');
        console.log(' UserOne details is', userOne)
        res.render('user-edit', { userData, userOne });
    });
});

// To edit each users role for the admin
route.post('/users/:userId/edit', UserLoggin, (req, res) => {
    const userId = req.params.userId;
    const newRole = req.body.role; // Assuming the role is sent in the request body

    // Update user role in the database
    const sql = `
      UPDATE fasttrac.users 
      SET role = ?
      WHERE user_id = ?;
    `;

    db.query(sql, [newRole, userId], (err, results) => {
        if (err) {
            console.log('Error updating user role:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/users'); // Redirect to the list of users or any appropriate route
    });
});


// To get single Query 

route.get('/shipments/:userId', UserLoggin, (req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userId = req.params.userId;
    

    const sql = `
      SELECT * FROM fasttrac.shipments WHERE user_id = ?;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error retrieving shipments:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userShip');
        req.app.set('userShip', results)
        // res.json(results);
        const userShip = req.app.get('userShip');
        console.log("The shipment history is", userShip)
        res.render('shipment', { userData, userShip })
    });
});



// To get all the shipments for the admin

route.get('/shipments', (req, res) => {
    const sql = `
        SELECT * 
        FROM fasttrac.shipments;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log('Error fetching shipments:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.json(results);
    });
});


module.exports = route;



