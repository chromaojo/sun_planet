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
const rand = rando + "SUN" + random;




// MiDDLE WARES 


route.use(express.urlencoded({ extended: true }));

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profile/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });



// To upload Profile Picture 
// route.post('/upload-pix', upload.single('profileImage'), (req, res) => {
//     const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

//     const userData = userCookie

//     try {
//         upload(req, res, function (err) {
//             if (err) {
//                 return res.send('Error uploading files.');
//             } 
//             const imagePath = req.file.path;
//             const profilePix = ''
//             let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET profilePix = ?  WHERE email = ?';
//             let values = [profilePix, userData.email];

//             console.log('The Profile pix path is in', imagePath  )
//             // db.query(updateUsername, values, (error, result) => {
//             //     if (error) {
//             //         console.log('An Update Error Occurred ', error);
//             //         res.status(500).send({ message: 'An Update Error Occurred' });
//             //     } 
//             //     console.log('Updated successfully !', result)
//             //     const sqlGetUserWithAccount = `
//             //     SELECT *
//             //     FROM bkew76jt01b1ylysxnzp.spc_users u
//             //     LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
//             //     WHERE u.email = ?;
//             //   `;
//             //     db.query(sqlGetUserWithAccount, [userData.email],  (error, result) => {
//             //         if (error) {

//             //             return res.status(500).json({
//             //                 message: 'Internal Server Error'
//             //             });
//             //         }

//             //         if (result.length === 0) {
//             //             return res.status(401).json({
//             //                 message: 'Invalid Data or Fields'
//             //             });
//             //         }

//             //         delete userData
//             //         req.app.set('userData', result[0])
//             //         const userWithAccount = result[0];
//             //         res.clearCookie('user');
//             //         res.cookie('user', JSON.stringify(userWithAccount));
//             //         if (userData.role ==='admin') {
//             //             res.redirect('/admin/profile');
//             //         } else {
//             //             res.redirect('/user/profile');  
//             //         }
//             //     });
//             // });
//         });

//     } catch (error) {
//         console.log('Property Form Error :', error)
//     }

// })
// Handle the form submission and file upload
route.post('/upload-pix', upload.single('profileImage'), (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userData = userCookie
    const imageP = '/' + req.file.path.replace(/\\/g, '/');
    const imagePath = imageP.replace('/public', '');
    console.log('Image Path is ', imagePath);

    db.query('UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET profilePix = ? WHERE user_id = ?;', [imagePath, userCookie.user_id]);
    console.log('The User id is ', userCookie.user_id);

    const sqlGetUserWithAccount = `
        SELECT *
        FROM bkew76jt01b1ylysxnzp.spc_users u
        LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
        WHERE u.email = ?;`;
    db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
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
        if (userData.role === 'admin') {
            res.redirect('/admin/profile');
        } else {
            res.redirect('/user/profile');
        }
    });
    });


    // To Update Surname 
    route.post('/surname', UserLoggin, (req, res) => {
        //  
        const { surname } = req.body;
        console.log('This is the surname', surname)
        if (surname) {
            try {

                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET surname = ?  WHERE email = ?';
                let values = [surname, userData.email];

                db.query(updateUsername, values, (error, result) => {
                    if (error) {
                        console.log('An Update Error Occurred ', error);
                        res.status(500).send({ message: 'An Update Error Occurred' });
                    }
                    console.log('Updated successfully !', result)
                    const sqlGetUserWithAccount = `
                SELECT *
                FROM bkew76jt01b1ylysxnzp.spc_users u
                LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
              `;
                    db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
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
                        if (userData.role === 'admin') {
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

    // To Update Username
    route.post('/username', UserLoggin, (req, res) => {
        //  
        const { username } = req.body;
        if (username) {
            try {
                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET username = ?  WHERE email = ?';
                let values = [username, userData.email];

                db.query(updateUsername, values, (error, result) => {
                    if (error) {
                        console.log('An Update Error Occurred ', error);
                        res.status(500).send({ message: 'An Update Error Occurred' });
                    }
                    console.log('Updated successfully !', result)
                    const sqlGetUserWithAccount = `
                SELECT *
                FROM bkew76jt01b1ylysxnzp.spc_users u
                LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
              `;
                    db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
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
                        if (userData.role === 'admin') {
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
    route.post('/other', UserLoggin, (req, res) => {
        //  
        const { othername } = req.body;
        if (othername) {
            try {
                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET othername = ?  WHERE email = ?';
                let values = [othername, userData.email];

                db.query(updateUsername, values, (error, result) => {
                    if (error) {
                        console.log('An Update Error Occurred ', error);
                        res.status(500).send({ message: 'An Update Error Occurred' });
                    }
                    console.log('Updated successfully !', result)
                    const sqlGetUserWithAccount = `
                SELECT *
                FROM bkew76jt01b1ylysxnzp.spc_users u
                LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
              `;
                    db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
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

                        if (userData.role === 'admin') {
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
    route.post('/phone_number', UserLoggin, (req, res) => {
        //  
        const { phone_number } = req.body;

        if (phone_number) {
            try {
                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET phone_number = ?  WHERE email = ?';
                let values = [phone_number, userData.email];

                db.query(updateUsername, values, (error, result) => {
                    if (error) {
                        console.log('An Update Error Occurred ', error);
                        res.status(500).send({ message: 'An Update Error Occurred' });
                    }
                    console.log('Updated successfully !', result)
                    const sqlGetUserWithAccount = `
                SELECT *
                FROM bkew76jt01b1ylysxnzp.spc_users u
                LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
              `;
                    db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
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
                        if (userData.role === 'admin') {
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

    // To Update Whatsapp Number 
    route.post('/whatsapp', UserLoggin, (req, res) => {
        //  
        const { whatsapp } = req.body;

        if (whatsapp) {
            try {
                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET whatsapp = ?  WHERE email = ?';
                let values = [whatsapp, userData.email];

                db.query(updateUsername, values, (error, result) => {
                    if (error) {
                        console.log('An Update Error Occurred ', error);
                        res.status(500).send({ message: 'An Update Error Occurred' });
                    }
                    console.log('Updated successfully !', result)
                    const sqlGetUserWithAccount = `
            SELECT *
            FROM bkew76jt01b1ylysxnzp.spc_users u
            LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
            WHERE u.email = ?;
            `;
                    db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
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
                        if (userData.role === 'admin') {
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
    route.post('/about', UserLoggin, (req, res) => {
        //  
        const { about } = req.body;

        if (about) {
            try {
                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET about = ?  WHERE email = ?';
                let values = [about, userData.email];

                db.query(updateUsername, values, (error, result) => {
                    if (error) {
                        console.log('An Update Error Occurred ', error);
                        res.status(500).send({ message: 'An Update Error Occurred' });
                    }
                    console.log('Updated successfully !', result)
                    const sqlGetUserWithAccount = `
                SELECT *
                FROM bkew76jt01b1ylysxnzp.spc_users u
                LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
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
                        if (userData.role === 'admin') {
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
    route.post('/facebook', UserLoggin, (req, res) => {
        //  
        const { facebook } = req.body;
        if (facebook) {
            try {
                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET facebook = ?  WHERE email = ?';
                let values = [facebook, userData.email];

                db.query(updateUsername, values, (error, result) => {
                    if (error) {
                        console.log('An Update Error Occurred ', error);
                        res.status(500).send({ message: 'An Update Error Occurred' });
                    }
                    console.log('Updated successfully !', result)
                    const sqlGetUserWithAccount = `
                SELECT *
                FROM bkew76jt01b1ylysxnzp.spc_users u
                LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
              `;
                    db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
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
                        if (userData.role === 'admin') {
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
    route.post('/address', UserLoggin, (req, res) => {
        //  
        const { address } = req.body;
        if (address) {
            try {
                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET address = ?  WHERE email = ?';
                let values = [address, userData.email];

                db.query(updateUsername, values, (error, result) => {
                    if (error) {
                        console.log('An Update Error Occurred ', error);
                        res.status(500).send({ message: 'An Update Error Occurred' });
                    }
                    console.log('Updated successfully !', result)
                    const sqlGetUserWithAccount = `
                SELECT *
                FROM bkew76jt01b1ylysxnzp.spc_users u
                LEFT JOIN bkew76jt01b1ylysxnzp.spc_accounts a ON u.user_id = a.user_id
                WHERE u.email = ?;
              `;
                    db.query(sqlGetUserWithAccount, [userData.email], (error, result) => {
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
                        if (userData.role === 'admin') {
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
    route.post('/password', UserLoggin, (req, res) => {
        //  
        const { old_password, new_password } = req.body;
        if (password) {
            try {
                const userData = req.app.get('userData');
                let updateUsername = 'UPDATE bkew76jt01b1ylysxnzp.spc_accounts SET password = ?  WHERE email = ?';
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