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
const allRept = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userId = userCookie.user_id;

    if (userCookie) {
        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ?`;
            db.query(sqls, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const sql = `
      SELECT * FROM sun_planet.spc__report ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            if (results) {
                const userRept = results
                const userData = userCookie
                return res.render('admin-report', { userData, userRept, notice, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

const allMyRept = async (req, res) => {


    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const user_id = userCookie.user_id;
    if (userCookie) {
        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ?`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const sql = `SELECT * FROM sun_planet.spc__report WHERE user_id = ? ORDER BY id DESC;`;

        db.query(sql, [user_id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }

            if (results) {
                const userRept = results
                const userData = userCookie
                return res.render('report-my', { userData, userRept, info, notice });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};


const oneRept = (req, res) => {

    const report_id = req.params.report_id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

  
    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        db.query('SELECT * FROM sun_planet.spc__report WHERE report_id =?', [report_id], (err, result) => {
            if (err) {
                res.send('Errors viewing Report')
                console.log('Viewing error ' + err)
            }

            const userReport = result[0]
            const sql = `
      SELECT * FROM sun_planet.spc__content WHERE report_id =?;
    `;

            db.query(sql, [report_id], (err, results) => {
                if (err) {
                    console.log('Report Viewing Issues :', err);
                    return res.status(500).send('Internal Report Server Error');
                }

                if (results) {
                    const reportCont = results
                    console.log('Report Content are ', reportCont)
                    console.log('User Report are ', userReport)
                    res.render('report-one', { userData, reportCont, userReport, info });
                }

            })

        });
    }
};



// To Post shipment form from the frontend 
const createRept = (req, res, next) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    const { title, description, Rept_status, price, location } = req.body;



    try {
        db.query('INSERT INTO sun_planet.spc_report SET ?', { title, description, Rept_status, price, location });

        res.json("Form Successfully Submitted")
    } catch (error) {
        console.log('Shipment Form Error :', error)
    }

}




// To delete a report content


const deleteRept = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const report_id = req.params.report_id;
            // Perform the deletion
            const sql = `DELETE FROM sun_planet.spc__content WHERE report_id = ?;`;
            db.query(sql, [report_id], (err, result) => {
                if (err) {
                    console.error('Error deleting report:', err);
                    return res.status(500).send('Internal Server Error');
                }
                
                const sql = `DELETE FROM sun_planet.spc__report WHERE report_id = ?;`;
                db.query(sql, [report_id], (err, result) => {
                    if (err) {
                        console.error('Error deleting report:', err);
                        return res.status(500).send('Internal Server Error');
                    }
                    // Check if any rows were affected
                    if (result.affectedRows === 0) {
                        return res.status(404).send('report content not found');
                    }


                    return next();
                });



            });

        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This report')
    }
};



module.exports = { oneRept, allRept, allMyRept, deleteRept, createRept }
