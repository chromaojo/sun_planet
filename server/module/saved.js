const express = require('express');
const route = express.Router();
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "TtXxL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');




const allAdSaved = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userId = userCookie.user_id

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_saved WHERE user_id = ? ORDER BY id DESC;
    `;

        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {

                const userSaved = results
                const userData = userCookie
                return res.render('admin-saved', { userData, userSaved, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};


// To View All Saved for one person
const allSaved = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userId = userCookie.user_id

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_saved WHERE user_id = ? ORDER BY id DESC;
    `;

        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {

                const userSaved = results
                const userData = userCookie
                return res.render('saved-all', { userData, userSaved, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};



// To view only one saved 

const oneSaved = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM sun_planet.spc_saved WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userSaved = results[0]
                console.log('Saved Items', userSaved)
                res.render('Saved-one', { userData, userSaved, info });
            }

        })
    }
};



// To create form from the frontend 
const createSaved = (req, res, next) => {
    const prop_id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userData = userCookie
    const user_id = userData.user_id;

    if (userData) {

        const sql = `
      SELECT * FROM sun_planet.spc_saved WHERE user_id = ? AND prop_id =?;
    `;


        db.query(sql, [user_id, prop_id], (err, results) => {
            if (err) { console.log("Customized Error ", err); }

            if (results.length > 0) {
                const error = 'Property Already Added'
                return res.render('error',{userData, error})
                
            }else{ 
                try {
                    const sql = `
                    SELECT * FROM sun_planet.spc_property WHERE prop_id = ?;
                  `;
    
                    db.query(sql, [prop_id], (err, results) => {
                        if (err) {
                            console.log('Login Issues :', err);
                            return res.status(500).send('Internal Server Error');
                        }
                        const { property_name, rent_price, property_type, id, city, state, picture, prop_id } = results[0]
                        const prop_link = '/admin/property-zZkKqQP/' + id;
                        
                        const user_id = userData.user_id
                        const pikz =picture.split(',')[0]  
                        const address = city+ ', ' + state

                        db.query('INSERT INTO sun_planet.spc_saved SET ?', { prop_link, property_name, user_id ,rent_price, property_type, address, prop_id, picture:pikz });
    
                        return next();
                    })
                } catch (error) {
                    console.log('Archive Form Error :', error)
                }
            }
           
        })


    } else {
        res.json('Added Successfully');
    }

}


// To delete a saved content


const deleteSaved = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM sun_planet.spc_saved WHERE prop_id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting saved:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('saved content not deleted');
                }
                return next();

            });


        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This saved')
    }
};



module.exports = { oneSaved, allSaved, allAdSaved, deleteSaved, createSaved }
