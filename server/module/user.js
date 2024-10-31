const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const random = Math.floor(Math.random() * 999999);
const rando = Math.floor(Math.random() * 9999999);
const rand = rando + "FTL" + random;



const allUser = async (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    const userId = req.params.userId;

    const notice = await new Promise((resolve, reject) => {
        const userId = userData.user_id
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
        db.query(sqls, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_users;
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
        
        res.render('user', { userData, userAll, notice })
    });
};



// To get each user detail 
const eachUser = async (req, res )=>{
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = req.params.user_id;
    const notice = await new Promise((resolve, reject) => {
        const userId = userData.user_id
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
        db.query(sqls, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const accts = await new Promise((resolve, reject) => {
        const userId = userData.user_id
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_accounts WHERE user_id = ?`;
        db.query(sqls, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    // Retrieve user data from the database based on userId
    const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_users WHERE user_id = ?;
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
        
        const userOne = results[0];
        const acct = accts[0];
        // const acct = accts;
        res.render('user-edit', { userData, userOne, acct , notice })
    });
}

// To edit each users role for the admin
const editUser = (req, res) => {
    const userId = req.params.userId;
    const newRole = req.body.role; // Assuming the role is sent in the request body

    // Update user role in the database
    const sql = `
      UPDATE bkew76jt01b1ylysxnzp.spc_users
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