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
const cookieParser = require('cookie-parser');
const session = require('express-session');




route.use(
    session({
        secret: `Hidden_Key`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);
route.use(express.json())


// To create Table for user and Account 
route.get('/createTable', (req, res) => {


    const sqlUsers = `
        CREATE TABLE IF NOT EXISTS fasttrac.users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff', 'customer') DEFAULT 'customer'
        );
        `;

    const sqlAccounts = `
        CREATE TABLE IF NOT EXISTS fasttrac.accounts (
        account_id VARCHAR(255) UNIQUE PRIMARY KEY,
        account_balance INT DEFAULT 0,
        total_spent INT DEFAULT 0,
        phone_number VARCHAR(255),
        whatsapp INT,
        surname VARCHAR(255),
        othername VARCHAR(255),
        username VARCHAR(255) UNIQUE,
        address VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        user_id INT UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
        `;

    const sqlShipments = `
        CREATE TABLE IF NOT EXISTS fasttrac.shipments (
        shipment_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        dateStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sender_name VARCHAR(255) NOT NULL,
        transaction_code VARCHAR(255) NOT NULL,
        sender_address VARCHAR(255) NOT NULL,
        sender_phone INT NOT NULL,
        sender_phone2 INT NOT NULL,
        receiver_name VARCHAR(255) NOT NULL,
        receiver_address VARCHAR(255) NOT NULL,
        receiver_phone INT NOT NULL,
        receiver_phone2 INT NOT NULL,
        shipment_weight INT NOT NULL,
        category VARCHAR(255) NOT NULL,
        item_quantity INT,
        dimension INT NOT NULL,
        shipment_description VARCHAR(355) NOT NULL,
        shipment_status ENUM('pending', 'arrived', 'delivered') DEFAULT 'pending'
        );
        `;

    db.query(sqlUsers, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Users Created Successfully');

        db.query(sqlAccounts, (errAccounts) => {
            if (errAccounts) {
                console.log('Error creating accounts table:', errAccounts);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Accounts Created Successfully');

            db.query(sqlShipments, (errShipments) => {
                if (errShipments) {
                    console.log('Error creating shipments table:', errShipments);
                    return res.status(500).send('Internal Server Error');
                }
                console.log('Shipments Created Successfully');

                res.send('Tables Created Successfully');
            });
        });
    });
});




// Register new user 
route.post('/register', (req, res) => {
    const { email, password, password1, surname, othername, username, address, phone_number } = req.body;

    db.query('SELECT email FROM fasttrac.users WHERE email = ?', [email], async (error, result) => {
        if (error) { console.log("Customized Error ", error); }
        if (result.length > 0) {
            return res.status(401).json({
                message: 'Email Already Taken'
            })
        } else if (password == password1) {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO fasttrac.users SET ?', { email: email, password: hashedPassword, role: 'customer' }, (error, result) => {
                if (error) {
                    console.log('A Registeration Error Occured ', error);
                } else {
                    // const messages = {
                    //     from: {
                    //         name: 'FASTTRAC INTERNATIONAL',
                    //         address: 'felixtemidayoojo@gmail.com',
                    //     },
                    //     to: email,
                    //     subject: "Welcome To Fasttrac Logistics",
                    //     text: `Welcome to FASTTRAC INT'L, \n \n  Your FASTTRAC Account has been opened successfully . \n Ensure that Your Password is kept safe. Incase of any compromise, ensure you change or optimizee the security on your application.`,
                    // }
                    // mail.sendIt(messages)

                    // To create the account table into the user 
                    db.query('SELECT * FROM fasttrac.accounts WHERE email = ?', [email], async (error, result) => {
                        if (error) {

                            return res.status(500).json({
                                message: 'Internal Server Error'
                            });
                        } else {

                            db.query('SELECT * FROM fasttrac.users WHERE email = ?', [email], async (error, result) => {
                                if (error) {

                                    return res.status(500).json({
                                        message: 'Internal Server Error'
                                    });
                                } else {
                                    db.query('INSERT INTO fasttrac.accounts SET ?', { user_id: result[0].user_id, email: email, account_id: rand, account_balance: 0, surname: surname, othername: othername, username: username, address: address, phone_number: phone_number });
                                }
                            });
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



// Login route
route.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user and account details with the provided email exists
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
       FROM fasttrac.users u
       LEFT JOIN fasttrac.accounts a ON u.user_id = a.user_id
       WHERE u.email = ?;
     `;
    db.query(sqlGetUserWithAccount, [email], async (error, result) => {
        if (error) {

            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: 'Invalid Email or Password'
            });
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, result[0].password);
        if (!isPasswordValid) {
            // Password is invalid
            return res.status(401).json({
                message: 'Invalid Email or Password'
            });

        }


        req.app.set('userData', result[0])


        const userWithAccount = result[0];
        
        res.cookie('user', JSON.stringify({ ...userWithAccount }));
        // req.session.userId = result[0].user_id
        res.redirect('/user/dashboard');
    });
});



// Dashboard route
route.get('/dashboard', (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData
    // const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    console.log('Here is my Dashboard Data', userCookie);
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const user = db.query('SELECT * FROM fasttrac.users WHERE email = ?', [userData.email], async (error, result) => {

            console.log('This is the dashboard Details : ', userData);
            if (error) {
                console.log(" Login Error :", error);
                return res.redirect('/logout');
            }
            if (result) {
                res.render('index', { userData, });
            }

        })
    }
});

// Dashboard route
route.get('/profile', UserLoggin, (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData
    console.log('Here is my Dashboard Data', userCookie);
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const user = db.query('SELECT * FROM fasttrac.users WHERE email = ?', [userData.email], async (error, result) => {

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

// To get the editing Page 

route.get('/edit', UserLoggin, (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    res.render('profileEdit', { userData, })
})



// Tp Update New Account Details 
route.use('/edit', require('./edit'));

// To Get shipment menu page
route.get('/shipmenu', UserLoggin, (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    res.render('shipment-menu', { userData, })
});

// To Get shipment form 
route.get('/shipment', UserLoggin, (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    res.render('shipment-form', { userData, })
})
// To Post shipment form from the frontend 
route.post('/shipmen', UserLoggin, (req,res)=>{
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    const { sender_name, sender_locate, sender_phone, sender_phone2, Sstate, Scountry, receiver_name, receiver_locate, receiver_phone, receiver_phone2, Rstate, Rcountry, category, shipment_description, item_quantity, dimension, shipment_weight } = req.body;

    let transaction_code = random+ 'FTSHIP'+ random;
    let sender_address = sender_locate + "\n State :"+ Sstate + "\n Country :"+ Scountry;
    let receiver_address = receiver_locate + "\n State :"+ Rstate + "\n Country :"+ Rcountry

    try {
        db.query('INSERT INTO fasttrac.shipments SET ?', { user_id: userData.user_id, sender_name, sender_address, sender_phone, sender_phone2, receiver_name, transaction_code, receiver_address, receiver_phone, receiver_phone2, category, shipment_description, item_quantity, dimension,shipment_weight});

        res.json("Form Successfully Submitted")
    } catch (error) {
        console.log('Shipment Form Error :',error)
    }

    res.json( {"In Summary : ": sender_name , sender_phone, sender_phone2, Sstate, Scountry, receiver_name, receiver_locate, receiver_phone, receiver_phone2,Rstate, Rcountry, category, shipment_description, item_quantity, dimension});
})

// To get each User's Shipment Query 
route.get('/shipments/:userId', UserLoggin, (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    const userId = req.params.userId;
    

    const sql = `
      SELECT * FROM fasttrac.shipments WHERE user_id = ?;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error retrieving shipments:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userShip');
        req.app.set('userShip', results)
        // res.json(results);
        const userShip = req.app.get('userShip');
        console.log("The shipment history is", userShip)
        res.render('shipment', { userData, userShip })
    });
});

// Logout route
route.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        delete userData
        res.clearCookie('user');
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/login');
        }
    });
});




module.exports = route;