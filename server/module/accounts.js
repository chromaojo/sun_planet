const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;



// username, surname, othername, phone_number, address

// To create User and Account 
// Register new user 
const regNew = (req, res) => {
    const { email, password, password1, surname, othername, username, address, phone_number } = req.body;

    db.query('SELECT email FROM bkew76jt01b1ylysxnzp.spc_users WHERE email = ?', [email], async (error, result) => {
        if (error) { console.log("Customized Error ", error); }
        if (result.length > 0) {

            const error = 'Email Already Taken'
            return res.render('error-home', { userData, error , layout: false})
        } else if (password == password1) {
            const user_id = 'SP' + random + 'Co'
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_users SET ?', { email: email, password: hashedPassword, user_id }, (error, result) => {
                if (error) {

                    const error = 'A Registeration Error Occured '
            return res.render('error-home', { userData, error , layout: false})
                } else {

                    // const messages = {
                    //     from: {
                    //         name: 'Property Biz Software',
                    //         address: 'felixtemidayoojo@gmail.com',
                    //     },
                    //     to: email,
                    //     subject: "Welcome To Property Biz App",
                    //     text: `<b> Dear New User, Welcome to Property Biz INT'L,</b> \n \n  Your Real Est Account has been opened successfully . \n Ensure that Your Password is kept safe. Incase of any compromise, ensure you change or optimizee the security on your application.`,
                    // } 
                    // mail.sendIt(messages)

                    // To create the account table into the user 
                    db.query('SELECT * FROM bkew76jt01b1ylysxnzp.spc_users WHERE email = ?', [email], async (error, result) => {
                        if (error) {

                            return res.status(500).json({
                                message: 'Internal Server Error'
                            });
                            
                        } else {
                            db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_accounts SET ?', { user_id: result[0].user_id, email: email, account_id: rand, account_balance: 0, surname: surname, othername: othername, username: username, address: address, phone_number: phone_number });
                        }
                    });


                    return res.redirect('/login');
                }

            });


        } else {
            return res.redirect('/register');
        }

    })

};


const regSamp = (req, res) => {
    // const { email, password, password1, surname, othername, username, address, phone_number } = req.body;

    const email = "admined@royalreality.com";
    const password = 'admin12345';
    const password1 = 'admin12345';
    const surname = 'Property';
    const username = "SUN0003";
    const role = 'admin'
    const othername = 'Planet'
    const phone_number = 1234567;
    const address = '123, Just a sample address to fill the space, Yaba, Akoka'

    db.query('SELECT email FROM bkew76jt01b1ylysxnzp.spc_users WHERE email = ?', [email], async (error, result) => {
        if (error) { console.log("Customized Error ", error); }
        if (result.length > 0) {

            const error = 'Email Already Taken'
            return res.render('error-home', { userData, error , layout: false})
        } else if (password == password1) {
            const user_id = 'SP' + random + 'Co'
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_users SET ?', { email: email, password: hashedPassword, user_id , role}, (error, result) => {
                if (error) {

                    const error = 'A Registeration Error Occured '
            return res.render('error-home', { userData, error , layout: false})
                } else {

                    // const messages = {
                    //     from: {
                    //         name: 'Property Biz Software',
                    //         address: 'felixtemidayoojo@gmail.com',
                    //     },
                    //     to: email,
                    //     subject: "Welcome To Property Biz App",
                    //     text: `<b> Dear New User, Welcome to Property Biz INT'L,</b> \n \n  Your Real Est Account has been opened successfully . \n Ensure that Your Password is kept safe. Incase of any compromise, ensure you change or optimizee the security on your application.`,
                    // } 
                    // mail.sendIt(messages)

                    // To create the account table into the user 
                    db.query('SELECT * FROM bkew76jt01b1ylysxnzp.spc_users WHERE email = ?', [email], async (error, result) => {
                        if (error) {

                            return res.status(500).json({
                                message: 'Internal Server Error'
                            });
                            
                        } else {
                            db.query('INSERT INTO bkew76jt01b1ylysxnzp.spc_accounts SET ?', { user_id: result[0].user_id, email: email, account_id: rand, account_balance: 0, surname: surname, othername: othername, username: username, address: address, phone_number: phone_number });
                        }
                    });


                    return res.redirect('/login');
                }

            });


        } else {
            return res.redirect('/register');
        }

    })

};

// To View User and Account details 
// User profile section
const profile = (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData
    console.log('Here is my Dashboard Data', userCookie);
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const user = db.query('SELECT * FROM bkew76jt01b1ylysxnzp.spc_users WHERE email = ?', [userData.email], async (error, result) => {

            // console.log('This is the dashboard Details : ', userData);
            if (error) {
                console.log(" Login Error :", error);
                return res.redirect('/user/logout');
            }
            if (result) {
                res.render('profile', { userData, });
            }

        })
    }
};




module.exports = {regNew, regSamp, profile};