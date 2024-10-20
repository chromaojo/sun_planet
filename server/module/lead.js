const express = require('express');
const route = express.Router();
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 999999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');







// To View All Lead
const allLead = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_lead ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userLead = results
                const userData = userCookie
                return res.render('lead', { userData, userLead, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};



// To View All My Lead
const allMyLead = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const user_id = userCookie.user_id;

    if (userCookie) {
        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_lead WHERE user_id = ? ORDER BY lead_id DESC;
    `;

        db.query(sql, [user_id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userLead = results
                const userData = userCookie
                return res.render('lead', { userData, userLead, info, notice });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All My Lead
const allMyAdLead = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const user_id = userCookie.user_id;

    if (userCookie) {
        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_lead WHERE user_id = ? ORDER BY lead_id DESC;
    `;

        db.query(sql, [user_id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userLead = results
                const userData = userCookie
                return res.render('admin-lead', { userData, userLead, info, notice });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};



// To view only one Lead 

const oneLead = async(req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
 
    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
            db.query(sqls, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_lead WHERE lead_id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userLead = results[0]
                console.log('Lead are ', userLead)
                res.render('lead-one', { userData, userLead, info ,notice });
            }

        })
    }
};





// To Post Lead form from the frontend 
const createLead = (req, res, next) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {

        // Check if email exists in the database

        const { first_name, last_name, title, gender, email, phone_number, company_name, job_title, industry, info, location } = req.body;

        const user_id = userData.user_id
        
        const lead_by = userData.surname + ' ' + userData.othername

        db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_lead SET ?', { first_name, last_name, title, gender, email, phone_number, company_name, job_title, industry, info, location, user_id, lead_by });
       return next();

    } catch (error) {
        console.log('Lead Form Error :', error)
    }

}




// To delete a Lead content


const deleteLead = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM jvmc.re_lead WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting Lead:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('Lead content not found');
                }

            });

            return next();
        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Lead')
    }
};



module.exports = { oneLead, allLead, allMyAdLead, allMyLead, deleteLead, createLead }
