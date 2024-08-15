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





// To View All Complain for one person
const allComplain = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM realEstate.re_complaint ORDER BY id DESC;
    `;

        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {

                const userComplain = results
                const userData = userCookie
                return res.render('complaint-admin', { userData, userComplain, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Complain for one person
const allMyComplain = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userId = userCookie.user_id

    if (userCookie) {
        const sql = `
      SELECT * FROM realEstate.re_complaint WHERE user_id = ? ORDER BY id DESC;
    `;

        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {

                const userComplain = results
                const userData = userCookie
                return res.render('complaints-client', { userData, userComplain, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};


// To view only one Complain 

const oneComplain = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM realEstate.re_complaint WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const useComplain = results[0]
                console.log('Complain Items ', useComplain)
                res.render('Complain-one', { userData, useComplain, info });
            }

        })
    }
};



// To Get Complain form 
const createComplains = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        return next();

    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To Post shipment form from the frontend 
const createComplain = (req, res) => {
    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    if (userData) {
        try {
            const sql = `
            SELECT * FROM realEstate.re_property WHERE id = ?;
          `;

            db.query(sql, [id], (err, results) => {
                if (err) {
                    console.log('Login Issues :', err);
                    return res.status(500).send('Internal Server Error');
                }
                const {title ,  price, location } = results[0]
                const pro_link ='/user/property-zZkKqQP/'+id;
                const user_id = userData.user_id
                const prop_id = random || rando
                const picture = '/assets/img/card.jpg'
                console.log('This is the propertyprice ',price);
                db.query('INSERT INTO realEstate.re_complaint SET ?', { title , location, pro_link, price, user_id, picture, prop_id });

                res.redirect('/user/Complain')
            })

        } catch (error) {
            console.log('Archive Form Error :', error)
        }

    } else {
        res.json('Added Successfully');
    }

}


// To get each User's Shipment Query 
const UserLoggi = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        return next();

    } else {
        return res.status(401).redirect('/user/logout');
    }
};


// To delete a Complain content


const deleteComplain = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM jvmc.re_complaint WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting Complain:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('Complain content not found');
                }

            });

            return next();
        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Complain')
    }
};



module.exports = { oneComplain, allComplain, allMyComplain, deleteComplain, createComplain }
