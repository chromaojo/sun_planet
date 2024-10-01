const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const random = Math.floor(Math.random() * 999999);
const rando = Math.floor(Math.random() * 9999999);
const rand = rando + "FTL" + random;



const allUser = (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    const userId = req.params.userId;


    const sql = `
      SELECT * FROM sun_planet.spc_users;
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
};



// To get each user detail 
const eachUser = (req, res, next)=>{
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = req.params.user_id;

    // Retrieve user data from the database based on userId
    const sql = `
      SELECT * FROM sun_planet.spc_users WHERE user_id = ?;
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.log('Error retrieving user data:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Check if user exists
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.clearCookie('userOne');
        
        const userOne = results[0]
        console.log(' UserOne details is', userOne)
        res.render('user-edit', { userData, userOne })
    });
}

// To edit each users role for the admin
const editUser = (req, res) => {
    const userId = req.params.userId;
    const newRole = req.body.role; // Assuming the role is sent in the request body

    // Update user role in the database
    const sql = `
      UPDATE sun_planet.spc_users
      SET role = ?
      WHERE user_id = ?;
    `;

    db.query(sql, [newRole, userId], (err, results) => {
        if (err) {
            console.log('Error updating user role:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userOne');
        res.redirect('/admin/admins'); // Redirect to the list of users or any appropriate route
    });
}


module.exports = {editUser, eachUser, allUser}