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





// To View All Invest
const allInvest = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM realestate.re_investment ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userInvest = results
                const userData = userCookie
                return res.render('invest-all', { userData, userInvest, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};



// To view only one investment 

const oneInvest = (req, res, next) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM realestate.re_investment WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userInvest = results[0]
                console.log('Investments are ', userInvest)
                res.render('Invest-one', { userData, userInvest, info });
            }

        })
    }
};

// To upload Profile Picture 
const uploadInvest = (req, res) => {

    const imageP = '/' + req.file.path.replace(/\\/g, '/');
    const imagePath = imageP.replace('/public', '');
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const user_id = userData.user_id

    const sql = `INSERT INTO jvmc.jvmc_month SET ?`;
        const values = { month, prepared_by, month_id };
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error storing account data:', err);
            return res.status(500).send('Internal Profile Error');
        }
        console.log(`Image Path: ${imagePath}`);

        res.send('Uploaded successfully !!!')
    });


};



// To Post shipment form from the frontend 
const createInvest = (req, res, next) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    const { title, description, Invest_status, price, location } = req.body;



    try {
        db.query('INSERT INTO realestate.re_investment SET ?', { title, description, Invest_status, price, location });

        res.json("Form Successfully Submitted")
    } catch (error) {
        console.log('Shipment Form Error :', error)
    }

    res.json('Added Successfully');
}




// To delete a investment content


const deleteInvest = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM jvmc.re_investment WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting investment:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('investment content not found');
                }

            });

            return next();
        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This investment')
    }
};



module.exports = { oneInvest, allInvest, deleteInvest, createInvest }
