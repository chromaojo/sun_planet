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
const { title } = require('process');
const { time } = require('console');



const myTrans = async (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = userCookie.user_id
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
    SELECT * FROM bkew76jt01b1ylysxnzp.spc_transaction WHERE user_id = ? ORDER BY transaction_id DESC;
  `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Login Issues :', err);
            return res.status(500).send('Internal Server Error');
        }


        if (results) {

            const userTran = results

            const userData = userCookie
            return res.render('transaction', { userData, userTran, notice })

        }

    })
}



// To View All Properties
const allTrans = async(req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const notice = await new Promise((resolve, reject) => {
        const status ='unread'
        const user_id = userCookie.user_id;
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    if (userCookie) {
        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_transaction ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userTrans = results
                const userData = userCookie
                return res.render('index', { userData, userTrans, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};



// To view only one Transaction 

const oneTrans = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_transaction WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userTrans = results[0]
                console.log('Properties are ', userTrans)
                res.render('trans-one', { userData, userTrans, info });
            } else {
                const error = "Account ID Doesn't Exist"
                return res.render('error', { userData, error, notice })

            }

        })
    }
};



// To Get Transaction form 
const makeTrans = async (req, res) => {

    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const { account_id } = req.body;
    const notice = await new Promise((resolve, reject) => {
        const status = 'unread'
        const user_id = userData.user_id;
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });


    if (userData) {
        const sql = `
        SELECT * FROM bkew76jt01b1ylysxnzp.spc_accounts WHERE account_id =?;
      `;

        db.query(sql, [account_id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userTranz = results[0]
                const myref = Math.floor(Math.random() * 99989999);
                const refs = random * myref;
                console.log('Details are ', userTranz)
                res.render('tranz', { userData, userTranz, notice, refs });
            }
        });

    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To Post shipment form from the frontend 
const postTrans = async(req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie;
    const transaction_type = 'credit';
    const created_by = userData.surname + " " + userData.othername +' | '+userData.email

    const { name, description, amount, user_id, payment_method, reference_number } = req.body;
    const notice = await new Promise((resolve, reject) => {
        const status ='unread'
        const user_id = userCookie.user_id;
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });


    try {
        // Only one refrence number is allowed. No duplicate

        const status = 'completed';
        db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_transaction SET ?', { name, description, amount, user_id, payment_method, reference_number, transaction_type, created_by, status });

        // Select the account and add the new ammount to the users Balance and Total Spent 
       

        const tot = await new Promise((resolve, reject) => {
          
          
            const sqls = `SELECT total_spent FROM bkew76jt01b1ylysxnzp.spc_accounts WHERE user_id =?;`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const old_total_spent = tot[0].total_spent
        const newAmount = parseFloat(amount)

        const total_spent = old_total_spent + newAmount

        db.query('UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET total_spent = ?  WHERE user_id = ?', [total_spent, user_id]);
        const title = "Transaction Balance"
        const content = 'A sum of '+amount+' NGN has been added to your transaction balance'
        console.log('Total Spent is ', total_spent)

        if (userData.role === 'admin') {
            const link = '/admin/transactions'
            db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_notification SET ?', { title, content, time, user_id, link });

            res.redirect('/admin/transactions')
        } else {
            const link = '/user/transactions'
            db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_notification SET ?', { title, content, time, user_id, link });

            res.redirect('/user/transactions')
        }
    } catch (err) {

        // res.send('Transaction error')
        const error = "Transaction Based Error"
       
        return res.render('error', { userData, error, notice })
    }


}




// To delete a Transaction content


const deleteTrans = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM jvmc.re_transaction WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting Transaction:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('Transaction content not found');
                }

            });

            return next();
        } catch (err) {
            console.error('Error handling transactions ', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Transaction')
    }
};



module.exports = { oneTrans, allTrans, deleteTrans, postTrans, makeTrans, myTrans }
