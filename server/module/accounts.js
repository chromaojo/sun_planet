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
route.post('/register', (req, res) => {
    const { email, password, password1, surname, othername, username, address, phone_number } = req.body;

    db.query('SELECT email FROM realEstate.re_users WHERE email = ?', [email], async (error, result) => {
        if (error) { console.log("Customized Error ", error); }
        if (result.length > 0) {
            return res.status(401).json({
                message: 'Email Already Taken'
            })
        } else if (password == password1) {
            const user_id = 'rE' + random + 'sT'
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO realEstate.re_users SET ?', { email: email, password: hashedPassword, user_id }, (error, result) => {
                if (error) {
                    console.log('A Registeration Error Occured ', error);
                } else {
                    // const messages = {
                    //     from: {
                    //         name: 'realEstate INTERNATIONAL',
                    //         address: 'felixtemidayoojo@gmail.com',
                    //     },
                    //     to: email,
                    //     subject: "Welcome To Real Est Logistics",
                    //     text: `Welcome to Real Est INT'L, \n \n  Your Real Est Account has been opened successfully . \n Ensure that Your Password is kept safe. Incase of any compromise, ensure you change or optimizee the security on your application.`,
                    // }
                    // mail.sendIt(messages)

                    // To create the account table into the user 
                    db.query('SELECT * FROM realEstate.re_users WHERE email = ?', [email], async (error, result) => {
                        if (error) {

                            return res.status(500).json({
                                message: 'Internal Server Error'
                            });
                        } else {
                            db.query('INSERT INTO realEstate.re_accounts SET ?', { user_id: result[0].user_id, email: email, account_id: rand, account_balance: 0, surname: surname, othername: othername, username: username, address: address, phone_number: phone_number });
                        }
                    });


                    return res.redirect('/login');
                }

            });


        } else {
            return res.redirect('/register');
        }

    })

});

// To View User and Account details 
// User profile section
route.get('/profile', UserLoggin, (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData
    console.log('Here is my Dashboard Data', userCookie);
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const user = db.query('SELECT * FROM realEstate.re_users WHERE email = ?', [userData.email], async (error, result) => {

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
});

// To Update Surname 
route.post('/surname', UserLoggin, async (req, res) => {
    //  
    const { surname } = req.body;
    if (surname) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE realestate.re_accounts SET surname = ?  WHERE email = ?';
            let values = [surname, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
            SELECT 
                u.user_id,
                
                u.email,
                u.role,
                a.account_id,
                a.total_spent,
                a.account_balance,
                a.phone_number,
                a.surname,
                a.othername,
                a.username,
                a.address,
                a.email as account_email
            FROM realestate.re_users u
            LEFT JOIN realestate.re_accounts a ON u.user_id = a.user_id
            WHERE u.email = ?;
            `;
                db.query(sqlGetUserWithAccount, [userData.email], async (error, result) => {
                    if (error) {

                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    if (result.length === 0) {
                        return res.status(401).json({
                            message: 'Invalid Data or Fields'
                        });
                    }

                    delete userData
                    req.app.set('userData', result[0])
                    const userWithAccount = result[0];
                    res.clearCookie('user');
                    res.cookie('user', JSON.stringify(userWithAccount));
                    res.redirect('/user/profile');

                });

            });
        } catch (err) {
            console.error('Error Loading Update:', err);
            res.status(500).send('Error Loading Update');
        }
    } else {
        res.redirect('/user/edit');
    }
});

// To Update Username
route.post('/username', UserLoggin, async (req, res) => {
    //  
    const { username } = req.body;
    if (username) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE realestate.re_accounts SET username = ?  WHERE email = ?';
            let values = [username, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
            SELECT 
                u.user_id,
                u.password,
                u.email,
                u.role,
                a.account_id,
                a.total_spent,
                a.account_balance,
                a.phone_number,
                a.surname,
                a.othername,
                a.username,
                a.address,
                a.email as account_email
            FROM realestate.re_users u
            LEFT JOIN realestate.re_accounts a ON u.user_id = a.user_id
            WHERE u.email = ?;
            `;
                db.query(sqlGetUserWithAccount, [userData.email], async (error, result) => {
                    if (error) {

                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    if (result.length === 0) {
                        return res.status(401).json({
                            message: 'Invalid Data or Fields'
                        });
                    }

                    delete userData
                    req.app.set('userData', result[0])
                    const userWithAccount = result[0];
                    res.clearCookie('user');
                    res.cookie('user', JSON.stringify(userWithAccount));
                    res.redirect('/user/profile');

                });

            });
        } catch (err) {
            console.error('Error Loading Update:', err);
            res.status(500).send('Error Loading Update');
        }
    } else {
        res.redirect('/user/edit');
    }
});

// To Update Other Name 
route.post('/other', UserLoggin, async (req, res) => {
    //  
    const { othername } = req.body;
    if (othername) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE realestate.re_accounts SET othername = ?  WHERE email = ?';
            let values = [othername, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT 
                    u.user_id,
                    u.password,
                    u.email,
                    u.role,
                    a.account_id,
                    a.total_spent,
                    a.account_balance,
                    a.phone_number,
                    a.surname,
                    a.othername,
                    a.username,
                    a.address,
                    a.email as account_email
                FROM realestate.re_users u
                LEFT JOIN realestate.re_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
                `;
                db.query(sqlGetUserWithAccount, [userData.email], async (error, result) => {
                    if (error) {

                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    if (result.length === 0) {
                        return res.status(401).json({
                            message: 'Invalid Data or Fields'
                        });
                    }

                    delete userData
                    req.app.set('userData', result[0])
                    const userWithAccount = result[0];
                    res.clearCookie('user');
                    res.cookie('user', JSON.stringify(userWithAccount));
                    res.redirect('/user/profile');

                });

            });
        } catch (err) {
            res.status(500).send('Error Loading Update');
        }
    } else {
        // Send Error Message For Empty Input
        res.redirect('/user/edit');
    }
});

// To Update Phone Number 
route.post('/phone_number', UserLoggin, async (req, res) => {
    //  
    const { phone_number } = req.body;
    if (phone_number) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE realestate.re_accounts SET phone_number = ?  WHERE email = ?';
            let values = [phone_number, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
            SELECT 
                u.user_id,
                u.password,
                u.email,
                u.role,
                a.account_id,
                a.total_spent,
                a.account_balance,
                a.phone_number,
                a.surname,
                a.othername,
                a.username,
                a.address,
                a.email as account_email
            FROM realestate.re_users u
            LEFT JOIN realestate.re_accounts a ON u.user_id = a.user_id
            WHERE u.email = ?;
            `;
                db.query(sqlGetUserWithAccount, [userData.email], async (error, result) => {
                    if (error) {

                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    if (result.length === 0) {
                        return res.status(401).json({
                            message: 'Invalid Data or Fields'
                        });
                    }

                    delete userData
                    req.app.set('userData', result[0])
                    const userWithAccount = result[0];
                    res.clearCookie('user');
                    res.cookie('user', JSON.stringify(userWithAccount));
                    res.redirect('/user/profile');

                });

            });
        } catch (err) {
            console.error('Error Loading Update:', err);
            res.status(500).send('Error Loading Update');
        }
    } else {
        res.redirect('/user/edit');
    }
});

// To Update Address 
route.post('/address', UserLoggin, async (req, res) => {
    //  
    const { address } = req.body;
    if (address) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE realestate.re_accounts SET address = ?  WHERE email = ?';
            let values = [address, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT 
                    u.user_id,
                    u.password,
                    u.email,
                    u.role,
                    a.account_id,
                    a.total_spent,
                    a.account_balance,
                    a.phone_number,
                    a.surname,
                    a.othername,
                    a.username,
                    a.address,
                    a.email as account_email
                FROM realestate.re_users u
                LEFT JOIN realestate.re_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
                `;
                db.query(sqlGetUserWithAccount, [userData.email], async (error, result) => {
                    if (error) {

                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }

                    if (result.length === 0) {
                        return res.status(401).json({
                            message: 'Invalid Data or Fields'
                        });
                    }

                    delete userData
                    req.app.set('userData', result[0])
                    const userWithAccount = result[0];
                    res.clearCookie('user');
                    res.cookie('user', JSON.stringify(userWithAccount));
                    res.redirect('/user/profile');

                });

            });
        } catch (err) {
            console.error('Error Loading Update:', err);
            res.status(500).send('Error Loading Update');
        }
    } else {
        res.redirect('/user/edit');
    }
});

// To Update Password 
// Make the password edit send a mail to the Email 
route.post('/password', UserLoggin, async (req, res) => {
    //  
    const { old_password , new_password } = req.body;
    if (password) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE realestate.re_accounts SET password = ?  WHERE email = ?';
            let values = [password, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                const messages = {
                        from: {
                            name: 'FASTTRAC INTERNATIONAL',
                            address: 'felixtemidayoojo@gmail.com',
                        },
                        to: userData.email,
                        subject: "FASTTRAC LOGISTICS",
                        text: `Dear Esteemed User ${userData.username}, \n \n Your New Password is \n <h1> ${new_password} </h1> . \n \n Your FASTTRAC Account Password has been changed successfully . \n \n Ensure that Your Password is kept safe. Incase of any compromise, ensure you change or optimize the security on your application. \n \n Contact our admin if need arises.`,
                    }
                    mail.sendIt(messages)
                console.log('Password Updated successfully !', result)
                res.redirect('/user/logout')

            });
        } catch (err) {

            res.status(500).send('Error Loading Update');
        }
    } else {
        res.json('Field is Empty !')
        // res.redirect('/user/profile');
    }
});




module.exports = route;