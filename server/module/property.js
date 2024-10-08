const express = require('express');
const route = express.Router();
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const random = Math.floor(Math.random() * 999999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');


// MiDDLE WARES 
// Configure multer for file storage in 'prop' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/prop/');
        // cb(null, path.join(__dirname, 'prop'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 4 // Limiting the number of files to 4
    }
}).array('pixz', 4);






// To View All Properties
const allProp = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    if (userCookie) {

    const notice = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ?`;
        db.query(sqls, [user_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const userProp = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM sun_planet.spc_property ORDER BY id DESC;`;
        db.query(sqls, [user_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    
    const userData = userCookie
    return res.render('admin-index', { userData, userProp, info , notice });
    } else {
        return res.status(401).redirect('/logout');
    }
};
// To View All Properties
const allAdProp = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = userCookie.user_id;
    req.app.set('userData', userCookie);
    if (userCookie) {
        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ?`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const userProp = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_property ORDER BY id DESC;`;
            db.query(sqls,  (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        
        const userData = userCookie
        return res.render('admin-index', { userData, userProp, info , notice });


    } else {
        return res.status(401).redirect('/logout');
    }
};


// To view only one property 

const oneProp = async (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = userCookie.user_id;
    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {

        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ?`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const userProps = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_property WHERE id =?;`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
      
        const userProp = userProps[0];
        return res.render('prop-one', { userData, userProp, info , notice });

    }
};

// To view Admin Prop 
const oneAdProp = async (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = userCookie.user_id;
    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {

        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ?`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const userProps = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_property WHERE id =?;`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
      
        const userProp = userProps[0];
        return res.render('admin-prop-one', { userData, userProp, info , notice });

    }
};



// To Post property form from the frontend 
const createProp = (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {
        upload(req, res, function (err) {
            if (err) {
                return res.send('Error uploading files.');
            }


            const { property_name, lease_status, description, property_type, rent_price, number_of_units, address, bedrooms, bathrooms, city, state, size_in_sqft, } = req.body;


            const prop_id = Math.floor(Math.random() * 999999);
            const country = 'Nigeria'
            const pixz = req.files.map(file => file.filename);
            const picture = '' + pixz + "";

            // Now you can handle the name, age, address, and pictures array
            // For example, save them to a database, send to another API, etc.

            db.query('INSERT INTO sun_planet.spc_property SET ?', { property_name, prop_id, picture, lease_status, property_type, rent_price, number_of_units, address, bedrooms, bathrooms, city, state, size_in_sqft, country, description, });
            res.redirect('/admin/props')
        });

    } catch (error) {
        console.log('Property Form Error :', error)
    }

}




// To delete a property content


const deleteProp = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;

            // Perform the deletion
            const sql = `DELETE FROM sun_planet.spc_property WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {

                    return res.status(500).send('Error deleting Property');
                }
                res.redirect('/admin/props')
            });


        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Property')
    }
};



module.exports = { oneProp, oneAdProp, allProp, allAdProp, deleteProp, createProp }
