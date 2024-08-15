const express = require('express');
const route = express.Router();
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');





// To View All Reports
const allRept = (req, res)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        const sql = `
      SELECT * FROM realEstate.re__report ORDER BY id DESC;
    `;

        db.query(sql,  (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
          
            
            if (results) {
                const userRept = results
                const userData = userCookie
                return res.render('report-my', { userData, userRept, info });
            }

        })
        
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};

const allMyRept = (req, res)=>{
    
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const user_id = userCookie.user_id;
    if (userCookie){
        const sql = `SELECT * FROM realEstate.re__report WHERE user_id = ? ORDER BY id DESC;`;

        db.query(sql, [user_id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
          
            
            if (results) {
                const userRept = results
                const userData = userCookie
                return res.render('report-my', { userData, userRept, info });
            }

        })
        
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};


const oneRept = (req, res, next)=>{
    
    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM realEstate.re_report WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);
            
            if (results) {
                const userRept = results[0]
                console.log('Repterties are ',userRept)
                res.render('Rept-one', { userData, userRept, info });
            }

        })
    }
};



// To Get report form 
const createRepts = (req, res)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        return next();
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};

// To Post shipment form from the frontend 
const createRept = (req, res, next) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    const { title , description ,Rept_status, price, location } = req.body;

    

    try {
        db.query('INSERT INTO realEstate.re_report SET ?', { title , description ,Rept_status, price, location  });

        res.json("Form Successfully Submitted")
    } catch (error) {
        console.log('Shipment Form Error :', error)
    }

    res.json('Added Successfully');
}


// To get each User's Shipment Query 
const UserLoggi = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        return next();
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};


// To delete a report content


const deleteRept = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM jvmc.re_report WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting report:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('report content not found');
                }

            });

            return next();
        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This report')
    }
};



module.exports = {oneRept, allRept, allMyRept, deleteRept, createRept}