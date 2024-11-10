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



const myTrans = async (req, res)=>{
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = userCookie.user_id
    const notice = await new Promise((resolve, reject) => {
        
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
        db.query(sqls, [userId], (err, results) => {
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
const allTrans = (req, res)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        const sql = `
      SELECT * FROM bkew76jt01b1ylysxnzp.spc_transaction ORDER BY id DESC;
    `;

        db.query(sql,  (err, results) => {
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
        
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};



// To view only one Transaction 

const oneTrans = (req, res)=>{
    
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
                console.log('Properties are ',userTrans)
                res.render('Trans-one', { userData, userTrans, info });
            }else{
                const error = "Account ID Doesn't Exist"
                return res.render('error',{userData, error, notice})

            }

        })
    }
};



// To Get Transaction form 
const makeTrans = async(req, res)=>{
    
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const account_id = req.params.id
    const notice = await new Promise((resolve, reject) => {
        const status ='unread'
        const user_id = userData.user_id;
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    
    if (userData){
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
                  const refs = random * rando;
                  console.log('Details are ',userTranz)
                  res.render('tranz', { userData, userTranz, notice, refs });
              }
    });
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};

// To Post shipment form from the frontend 
const createTrans = (req, res, next) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    const { title , description ,Trans_status, price, location } = req.body;

    

    try {
        db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_transaction SET ?', { title , description ,Trans_status, price, location  });

        res.json("Form Successfully Submitted")
    } catch (error) {
        console.log('Shipment Form Error :', error)
    }

    res.json('Added Successfully');
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



module.exports = {oneTrans, allTrans, deleteTrans, createTrans , makeTrans , myTrans}
