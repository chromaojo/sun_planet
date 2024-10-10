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




// To View All Renterties
const allRent = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const user_id = userCookie.user_id;
    if (userCookie) {

    const notice = await new Promise((resolve, reject) => {
        const user_id = userCookie.user_id;
        const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ?`;
        db.query(sqls, [user_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const userRent = await new Promise((resolve, reject) => {

        const sqls = `SELECT * FROM sun_planet.spc_rent ORDER BY id DESC;`;
        db.query(sqls, [user_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    
    const userData = userCookie
    return res.render('index', { userData, userRent, info , notice });
    } else {
        return res.status(401).redirect('/logout');
    }
};
// To View All Renterties
const allAdRent = async (req, res) => {

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
        const userRent = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_rent ORDER BY id DESC;`;
            db.query(sqls,  (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        
        const userData = userCookie
        return res.render('admin-index', { userData, userRent, info , notice });


    } else {
        return res.status(401).redirect('/logout');
    }
};


// To view only one property 

const oneRent = async (req, res) => {

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
        const userRents = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_rent WHERE id =?;`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
      
        const userRent = userRents[0];
        return res.render('prop-one', { userData, userRent, info , notice });

    }
};

// To view Admin Rent 
const oneAdRent = async (req, res) => {

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
        const userRents = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_rent WHERE id =?;`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
      
        const userRent = userRents[0];
        return res.render('admin-prop-one', { userData, userRent, info , notice });

    }
};



// To Post property form from the frontend 
const createRent = (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {
        upload(req, res, function (err) {
            if (err) {
                return res.send('Error uploading files.');
            }


            const { property_name, youtube, lease_status, description, property_type, rent_price, number_of_units, address, bedrooms, bathrooms, city, state, size_in_sqft, } = req.body;


            const prop_id = Math.floor(Math.random() * 999999);
            const country = 'Nigeria'
            const pixz = req.files.map(file => file.filename);
            const picture = '' + pixz + "";

            // Now you can handle the name, age, address, and pictures array
            // For example, save them to a database, send to another API, etc.

            db.query('INSERT INTO sun_planet.spc_rent SET ?', { property_name, youtube, prop_id, picture, lease_status, property_type, rent_price, number_of_units, address, bedrooms, bathrooms, city, state, size_in_sqft, country, description, });
            res.redirect('/admin/rents')
        });

    } catch (error) {
        console.log('Renting Form Error :', error)
    }

}




// To delete a property content


const deleteRent = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;

            // Perform the deletion
            const sql = `DELETE FROM sun_planet.spc_rent WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {

                    return res.status(500).send('Error deleting Renting');
                }
                res.redirect('/admin/rents')
            });


        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Renting')
    }
};



module.exports = { oneRent, oneAdRent, allRent, allAdRent, deleteRent, createRent }
