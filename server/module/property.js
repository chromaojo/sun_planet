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





// To View All Properties
const allProp = (req, res)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        const sql = `
      SELECT * FROM realEstate.re_property ORDER BY id DESC;
    `;

        db.query(sql,  (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
          
            
            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('index', { userData, userProp, info });
            }

        })
        
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};



// To view only one property 

const oneProp = (req, res, next)=>{
    
    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM realEstate.re_property WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);
            
            if (results) {
                const userProp = results[0]
                console.log('Properties are ',userProp)
                res.render('prop-one', { userData, userProp, info });
            }

        })
    }
};



// To Get property form 
const createProps = (req, res)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        return next();
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};

// To Post property form from the frontend 
const createProp = (req, res, next) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    const { title , description ,prop_status, price, location } = req.body;

    

    try {
        db.query('INSERT INTO realEstate.re_property SET ?', { title , description ,prop_status, price, location  });

        res.json("Form Successfully Submitted")
    } catch (error) {
        console.log('Shipment Form Error :', error)
    }

    res.json('Added Successfully');
}




// To delete a property content


const deleteProp = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM jvmc.re_property WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting Property:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('property content not found');
                }

            });

            return next();
        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Property')
    }
};



module.exports = {oneProp, allProp, deleteProp, createProp}
