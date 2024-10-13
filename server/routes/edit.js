const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const multer = require('multer');

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;


// MiDDLE WARES 
// Configure multer for file storage in 'prop' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profile/');
        // cb(null, path.join(__dirname, 'prop'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 1 // Limiting the number of files to 4
    }
}).array('pixz', 4);





// To upload Profile Picture 
route.post('/profile', (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {
        upload(req, res, function (err) {
            if (err) {
                return res.send('Error uploading files.');
            }
            // Now you can handle the name, age, address, and pictures array
            // For example, save them to a database, send to another API, etc.

            db.query('INSERT INTO sun_planet.spc_property SET ?', { property_name, youtube, prop_id, picture, lease_status, property_type, rent_price, number_of_units, address, bedrooms, bathrooms, city, state, size_in_sqft, country, description, });
            res.redirect('/admin/props')
        });

    } catch (error) {
        console.log('Property Form Error :', error)
    }

})


// To Update Surname 
route.post('/surname', UserLoggin, async (req, res) => {
    //  
    const { surname } = req.body;
    if (surname) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET surname = ?  WHERE email = ?';
            let values = [surname, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT *
                FROM sun_planet.spc_users u
                LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
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
                    if (userData.role ==='admin') {
                        res.redirect('/admin/profile');
                    } else {
                        res.redirect('/user/profile');  
                    }
                   

                });

            });
        } catch (err) {
            console.error('Error Loading Update:', err);
            res.status(500).send('Error Loading Update');
        }
    } else {
        if (userData.role ==='admin') {
            res.redirect('/admin/edit');
        } else {
            res.redirect('/user/edit');  
        }
    }
});

// To Update Username
route.post('/username', UserLoggin, async (req, res) => {
    //  
    const { username } = req.body;
    if (username) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET username = ?  WHERE email = ?';
            let values = [username, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT *
                FROM sun_planet.spc_users u
                LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
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
                    if (userData.role ==='admin') {
                        res.redirect('/admin/profile');
                    } else {
                        res.redirect('/user/profile');  
                    }

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
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET othername = ?  WHERE email = ?';
            let values = [othername, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT *
                FROM sun_planet.spc_users u
                LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
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
                    
                    if (userData.role ==='admin') {
                        res.redirect('/user/profile');
                    } else {
                        res.redirect('/user/profile');  
                    }
                    

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
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET phone_number = ?  WHERE email = ?';
            let values = [phone_number, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT *
                FROM sun_planet.spc_users u
                LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
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
                    if (userData.role ==='admin') {
                        res.redirect('/user/profile');
                    } else {
                        res.redirect('/user/profile');  
                    }
                    

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

// To Update Whatsapp Number 
route.post('/whatsapp', UserLoggin, async (req, res) => {
    //  
    const { whatsapp } = req.body;

    if (whatsapp) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET whatsapp = ?  WHERE email = ?';
            let values = [whatsapp, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
            SELECT 
                u.user_id,
                a.acct_type
                u.email,
                u.role,
                a.account_id,
                a.total_spent,
                a.account_balance,
                a.phone_number,
                a.surname,
                a.whatsapp,
                a.linkedin,
                a.about,
                a.facebook,
                a.instagram,
                a.current_rent,
                a.othername,
                a.username,
                a.address,
                a.email as account_email
            FROM sun_planet.spc_users u
            LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
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
                    if (userData.role ==='admin') {
                        res.redirect('/admin/profile');
                    } else {
                        res.redirect('/user/profile');  
                    }
                    

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

// To Update Phone Number 
route.post('/about', UserLoggin, async (req, res) => {
    //  
    const { about } = req.body;

    if (about) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET about = ?  WHERE email = ?';
            let values = [about, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT *
                FROM sun_planet.spc_users u
                LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
                `;
                db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            message: 'Internal Error Uploading About'
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
                    if (userData.role ==='admin') {
                        res.redirect('/admin/profile');
                    } else {
                        res.redirect('/user/profile');  
                    }
                    

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

// To Update Facebook 
route.post('/facebook', UserLoggin, async (req, res) => {
    //  
    const { facebook } = req.body;
    if (facebook) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET facebook = ?  WHERE email = ?';
            let values = [facebook, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT *
                FROM sun_planet.spc_users u
                LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
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
                    if (userData.role ==='admin') {
                        res.redirect('/user/profile');
                    } else {
                        res.redirect('/user/profile');  
                    }
                    

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
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET address = ?  WHERE email = ?';
            let values = [address, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                console.log('Updated successfully !', result)
                const sqlGetUserWithAccount = `
                SELECT *
                FROM sun_planet.spc_users u
                LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
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
                    if (userData.role ==='admin') {
                        res.redirect('/admin/profile');
                    } else {
                        res.redirect('/user/profile');  
                    }
                    

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
    const { old_password, new_password } = req.body;
    if (password) {
        try {
            const userData = req.app.get('userData');
            let updateUsername = 'UPDATE sun_planet.spc_accounts SET password = ?  WHERE email = ?';
            let values = [password, userData.email];

            db.query(updateUsername, values, (error, result) => {
                if (error) {
                    console.log('An Update Error Occurred ', error);
                    res.status(500).send({ message: 'An Update Error Occurred' });
                }
                const messages = {
                    from: {
                        name: 'Sun Planet Ltd',
                        address: 'felixtemidayoojo@gmail.com',
                    },
                    to: userData.email,
                    subject: "Sun Planet IT Department",
                    text: `Dear Esteemed User ${userData.username}, \n ${userData.surname}, We detect that you have attempted to change your passwor few minutes ago \n Your New Password is \n <h1> ${new_password} </h1> . \n \n Your Sun Planet Account Password has been changed successfully . \n \n Ensure that Your Password is kept safe. Incase of any compromise, ensure you alart our IT department. \n \n Contact our admin if need arises.`,
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