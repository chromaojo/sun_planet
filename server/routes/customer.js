const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { UserLoggin } = require('../auth/auth');
const {allMyNotice} = require('../module/notification');
const { createRent, allMyRent, oneRent, oneFillRent  }=require('../module/rent')
const { allMyLead, allLead, oneLead, createLead } = require('../module/lead');
const { allProp, oneProp, allFiltProp, allSearchProp } = require('../module/property');
const { allMyComplain, allComplain, createComplain } = require('../module/complaint');
const { allMyRept, allRept, oneRept, deleteRept } = require('../module/report');
const { allSaved, oneSaved, createSaved, deleteSaved } = require('../module/saved');
const { allInvest, oneInvest, createInvest } = require('../module/investment');
let random = Math.floor(Math.random() * 999999999 / 1.9);
let rando = Math.floor(Math.random() * 99999);
const rand = rando + "rEs" + random;
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
route.use(express.urlencoded({ extended: true }));




// See All Properties 

route.get('/dashboard', allProp, (req, res) => {

});



// To Filter or search All Properties 

route.post('/filter110', allFiltProp, (req, res) => {

});

// To Filter or search All Properties 

route.post('/search-prop', allSearchProp, (req, res) => {

});



// To Read One Property detail 
route.get('/property-zZkKqQP/:id', oneProp, (req, res) => {


});


// To gat Create Property
route.get('/transactions', async (req, res) => {

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

});



// To Read All Investments 
route.get('/investments', allInvest, (req, res) => {

});

// To Read One Investment detail 
route.get('/invest/:id', oneInvest, (req, res) => {

    res.send('Route is okay')
});



// User profile section
route.get('/profile', UserLoggin, async (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData;
    const user_id = userCookie.user_id
    
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const notice = await new Promise((resolve, reject) => {
            const status ='unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        }); 
        const user = db.query('SELECT * FROM bkew76jt01b1ylysxnzp.spc_users WHERE email = ?', [userData.email], async (error, result) => {

            // console.log('This is the dashboard Details : ', userData);
            if (error) {
                console.log(" Login Error :", error);
                return res.redirect('/admin/logout');
            }
            if (result) {
               
                console.log(" Notice is :", notice);
                res.render('profile', { userData, notice });
            }

        })
    }
});


// To Get all the saved Property details
route.get('/save/:id', createSaved, (req, res) => {

    res.redirect('/user/saved')
});


// To Get all the saved Property details
route.get('/delet/:id', deleteSaved, (req, res) => {

    res.redirect('/user/saved')
});

// To Get all my Report details
route.get('/my-report', allMyRept, (req, res) => {

});

// To Get all my Report details
route.get('/reeport/:report_id', oneRept, (req, res) => {

});

// To Get all my Report details
route.get('/delRep/:report_id', deleteRept, (req, res) => {
    res.redirect('/user/my-report')
});


// To Get all my saved Property details
route.get('/saved', allSaved, (req, res) => {


});

// To get the editing Page  
route.use('/edit', require('../routes/edit'));


// To Get all my saved Property details
route.get('/complaints', allMyComplain, (req, res) => {
});

// To Get all my saved Property details
route.post('/complaints/xXPpRyds', createComplain, (req, res) => {


});

// To Get all saved Property details
route.get('/mYlead', allLead, (req, res) => {


});

// To Get all my saved Property details
route.get('/mYlead/wWwCcYtT', allMyLead, (req, res) => {


});

route.get('/vVxYLead/:id', oneLead, (req, res) => {


});


// To Get all my saved Property details
route.post('/lead/KxkRTtyZx', createLead, (req, res) => {
    res.redirect('/user/mYlead/wWwCcYtT')

});

// To get all my rent 
route.get('/rent', allMyRent);

// To view only one rent details
route.get('/renter/:id', oneRent);

// To view only one rent details
route.get('/apply-rent/:id', oneFillRent);

// To post data from frontend
route.post('/rental-submit', createRent, (req, res)=>{
      
    res.redirect('/user/rent');
});


// To get all my notification 
route.get('/notif', allMyNotice, (req, res) => {

});


// Logout route
route.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        delete userData
        delete userCookie
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