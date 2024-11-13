const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const {notice, }= require('../config/info')
const bcrypt = require('bcryptjs');
const { UserLoggin } = require('../auth/auth');
const {myTrans, makeTrans, postTrans }=require('../module/transactions');
const { createRent,allRent, allMyRent, oneFillRent, oneRent, approveRent}=require('../module/rent')
const {eachUser, editUser, allUser }=require('../module/user')
const {regNew} = require('../module/accounts')
const {allMyNotice, deleteNotice, } = require('../module/notification')
const { allMyAdLead, oneLead, createLead } = require('../module/lead');
const { allAdProp, oneAdProp, createProp, deleteProp, editProp, updateProp } = require('../module/property');
const { allComplain, createComplain } = require('../module/complaint');
const { allMyRept, allRept, oneRept, deleteRept } = require('../module/report');
const { allAdSaved, createSaved, deleteSaved , createSavedAdmin } = require('../module/saved');
const { allAdInvest, oneInvest, createInvest } = require('../module/investment');
let random = Math.floor(Math.random() * 99999999 / 13.9);
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










// To get notifications 
route.get('/notif', allMyNotice, (req, res) => {

});


// The Users Section


// To get all users 
route.get('/users', allUser, (req, res) => {

});

// To get each user detail 
route.get('/uzer/:user_id', eachUser, (req, res) => {

});



// To edit each users role for the admin
route.post('/:user_id/edit', UserLoggin, (req, res) => {
    const userId = req.params.user_id;
    const newRole = req.body.role; // Assuming the role is sent in the request body

    // Update user role in the database
    const sql = `
      UPDATE bkew76jt01b1ylysxnzp.spc_users
      SET role = ?
      WHERE user_id = ?;
    `;
  
    db.query(sql, [newRole, userId], (err, results) => {
        if (err) {
            console.log('Error updating user role:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userOne');
        res.redirect('/admin/users'); // Redirect to the list of users or any appropriate route
    });
});


// Dashboard route
route.get('/dashboard', async(req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = userData.user_id;
    // const lan = 'land';
    // const build = 'building';
    // const short = 'shortlet';

    const property = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_property ORDER BY id DESC`;
        db.query(sqls, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });


    const notice = await new Promise((resolve, reject) => {
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
        db.query(sqls,[user_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    // const land = await new Promise((resolve, reject) => {
    //     const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_property WHERE prop_type = ?`;
    //     db.query(sqls,[lan], (err, results) => {
    //         if (err) return reject(err);
    //         resolve(results);
    //     });
    // });
    // const building = await new Promise((resolve, reject) => {
    //     const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_property WHERE prop_type = ?`;
    //     db.query(sqls,[build], (err, results) => {
    //         if (err) return reject(err);
    //         resolve(results);
    //     });
    // });
    // const shortlet = await new Promise((resolve, reject) => {
    //     const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_property WHERE prop_type = ?`;
    //     db.query(sqls,[short], (err, results) => {
    //         if (err) return reject(err);
    //         resolve(results);
    //     });
    // });
    // const investment = await new Promise((resolve, reject) => {
    //     const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_investment ORDER BY id DESC`;
    //     db.query(sqls, (err, results) => {
    //         if (err) return reject(err);
    //         resolve(results);
    //     });
    // });
    // const complain = await new Promise((resolve, reject) => {
    //     const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_complaint ORDER BY id DESC`;
    //     db.query(sqls, (err, results) => {
    //         if (err) return reject(err);
    //         resolve(results);
    //     });
    // });
   
    res.render('dashboard',{userData, property, notice})
});
// See All Properties 

route.get('/props', allAdProp, (req, res) => {

});

route.get('/del-prop/:id', deleteProp, (req, res) => {

});


// To Read One Property detail 
route.get('/property-zZkKqQP/:id', oneAdProp, (req, res) => {


});

// To edit a property 
route.get('/property-edit/:id', editProp, (req, res) => {


});

// To post update Property
route.post('/create/pXrRoPp', updateProp, (req, res) => {


});


// To gat Create Property
route.get('/create/prop', async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userData = userCookie
    const notice = await new Promise((resolve, reject) => {
        const userId = userCookie.user_id
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
        db.query(sqls, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    res.render('prop-create', { userData, notice })
});

// To gat Create Property
route.post('/create/pXrRoPp', createProp, (req, res) => {


});


// To register a new account 
route.get('/register', (req, res) => {


    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    if (userCookie) {
        res.sendFile(path.join(__dirname, "../../statics", 'signUp.html'));

    } else {

        res.redirect('/login');
    }
})


 route.post('/XDcxXLQ/register', regNew)

// To gat my Transactions
route.get('/transactions', myTrans);

// To get the transaction page 
route.get('/tranzact/:id', makeTrans);

// To get the transaction page 
route.post('/tranzact', makeTrans);

// To post a transaction 
route.post('/tranzit/GgTxXWyQkDx', postTrans);


// To gat All rent
route.get('/all-rent', allRent);

// To gat One rent
route.get('/renter/:id', oneRent);

// To view only one rent details
route.get('/apply-rent/:id', oneFillRent);

// To post data from frontend
route.post('/rental-submit', createRent, (req, res)=>{
      
    res.redirect('/admin/all-rent');
});

// To gat validate rent
route.post('/vali-rent/:id', approveRent);


// To Read All Investments 
route.get('/investments', allAdInvest, (req, res) => {

});


// To Read One Investment detail 
route.get('/invest/:id', oneInvest, (req, res) => {

    res.send('Route is okay')
});

// To To Get CReate Investment page
route.get('/investe', UserLoggin, async (req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const notice = await new Promise((resolve, reject) => {
        const userId = userData.user_id
        const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
        db.query(sqls, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    res.render('invest-create', { userData, notice })
});

// To Post Investment 
route.post('/xXpPLliLZz', createInvest, (req, res) => {


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
            const sqls = `SELECT * FROM bkew76jt01b1ylysxnzp.spc_notification WHERE user_id = ?`;
            db.query(sqls,[user_id], (err, results) => {
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


// To create Saved Properties
route.get('/save/:id', createSavedAdmin, (req, res) => {

    res.redirect('/admin/saved')
});


// To Get all the saved Property details
route.get('/delet/:id', deleteSaved, (req, res) => {

    res.redirect('/admin/saved')
});


// Report Section 

// To Get all my Report details
route.get('/my-report', allMyRept, (req, res) => {

});

// To Get one Report details
route.get('/reeport/:report_id', oneRept, (req, res) => {

});

// To delete a Report details
route.get('/delRep/:report_id', deleteRept, (req, res) => {
    res.redirect('/admin/my-report')
});


// To Get all Report list
route.get('/all-report', allRept, (req, res) => {

});

// To Get all my saved Property details
route.get('/saved', allAdSaved, (req, res) => {


});

// To get the editing Page  
route.use('/edit', require('../routes/edit'));


// To Get all my Complain details
route.get('/complaints', allComplain, (req, res) => {
});

// To post all my Complain details
route.post('/complaints/xXPpRyds', createComplain, (req, res) => {


});


// To Get all my lead details
route.get('/mYlead/wWwCcYtT', allMyAdLead, (req, res) => {


});

route.get('/vVxYLead/:id', oneLead, (req, res) => {


});


// To Get all my Lead details
route.post('/lead/KxkRTtyZx', createLead, (req, res) => {
    res.redirect('/admin/mYlead/wWwCcYtT');


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
