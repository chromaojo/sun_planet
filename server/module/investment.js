const express = require('express');
const route = express.Router();
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
let random = Math.floor(Math.random() * 9990999999);
let rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');




// Configure multer for file storage in 'prop' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/invest/');
        // cb(null, path.join(__dirname, 'prop'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 2 // Limiting the number of files to 4
    }
}).array('pixz', 4);





// To View All Invest
const allInvest = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        const notice = await new Promise((resolve, reject) => {
            const status ='unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        }); 

        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_investment ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userInvest = results
                const userData = userCookie
                return res.render('invest-all', { userData, userInvest, info, notice });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Invest
const allAdInvest = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userId = userCookie.user_id;

    if (userCookie) {
        const notice = await new Promise((resolve, reject) => {
            const status ='unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        }); 

        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_investment ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userInvest = results
                const userData = userCookie
                return res.render('admin-invest-all', { userData, userInvest, notice });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};



// To view only one investment 

const oneInvest = async(req, res, next) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const notice = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
            db.query(sqls, [userData.user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_investment WHERE id =?;
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
                res.render('Invest-one', { userData, notice, userInvest, info });
            }

        })
    }
};



// To Post shipment form from the frontend 
const createInvest = (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    let invest_id = random || rando


   if(userData){
    try {
        upload(req, res, function (err) {
            if (err) {
                return res.send('Error uploading files.');
            }
            const date = Date.now()
            const { title , details, price } = req.body;  
            const pixz = req.files.map(file => file.filename);

            const picture = '/invest/'+pixz;
          
            db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_investment SET ?', { title , details , invest_id, price , picture , date });
           
           if (userCookie.role ==='client') {
            res.redirect('/user/investments');
           } else {
            res.redirect('/admin/investments');
           }
        });
       
    } catch (error) {
        console.log('Property Form Error :', error)
    }
   }
   

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



module.exports = { oneInvest, allInvest, allAdInvest, deleteInvest, createInvest }
