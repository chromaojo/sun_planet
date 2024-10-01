const express = require('express');
const route = express.Router();
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const random = Math.floor(Math.random() * 999999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');


// MiDDLE WARES 
// Configure multer for file storage in 'prop' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/prop/');
        // cb(null, path.join(__dirname, 'prop'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 4 // Limiting the number of files to 4
    }
}).array('pixz', 4);






// To View All Properties
const allProp = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_property ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('index', { userData, userProp, info });
            }

        })


    } else {
        return res.status(401).redirect('/logout');
    }
};
// To View All Properties
const allAdProp = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_property ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('admin-index', { userData, userProp, info });
            }

        })


    } else {
        return res.status(401).redirect('/logout');
    }
};

// To View All Commercial Properties
const allComProp = (req, res) => {

    const category = 'commercial'

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_property WHERE category = ? ORDER BY id DESC;
    `;

        db.query(sql, [category], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('index', { userData, userProp, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Residentioal Properties
const allResProp = (req, res) => {

    const category = 'residential'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_property ORDER BY id DESC;
    `;

        db.query(sql, [category], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('index', { userData, userProp, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All shortlet Properties
const allShortProp = (req, res) => {
    const prop_type = 'shortlet'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_property WHERE prop_type = ? ORDER BY id DESC;
    `;

        db.query(sql, [prop_type], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('index', { userData, userProp, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Rented Properties
const allRentProp = (req, res) => {
    const action = 'rent'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_property WHERE action = ? ORDER BY id DESC;
    `;

        db.query(sql, [action], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('index', { userData, userProp, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Lease Properties
const allLeaseProp = (req, res) => {
    const action = 'lease'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_property WHERE action = ? ORDER BY id DESC;
    `;

        db.query(sql, [action], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('index', { userData, userProp, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All sSale Properties
const allSaleProp = (req, res) => {
    const action = 'sale'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_property WHERE action = ? ORDER BY id DESC;
    `;

        db.query(sql, [action], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userProp = results
                const userData = userCookie
                return res.render('index', { userData, userProp, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};




// To view only one property 

const oneProp = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM sun_planet.spc_property WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userProp = results[0]
                console.log('Properties are ', userProp)
                res.render('prop-one', { userData, userProp, info });
            }

        })
    }
};

// To view Admin Prop 
const oneAdProp = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM sun_planet.spc_property WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userProp = results[0]
                console.log('Properties are ', userProp)
                res.render('admin-prop-one', { userData, userProp, info });
            }

        })
    }
};



// To Post property form from the frontend 
const createProp = (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {
        upload(req, res, function (err) {
            if (err) {
                return res.send('Error uploading files.');
            }


            const { title, description, prop_type, category, action, price, location } = req.body;

            let prop_id = rando || random
            const pixz = req.files.map(file => file.filename);

            const prop_status = 'active';
            const picture = '' + pixz + "";

            // Now you can handle the name, age, address, and pictures array
            // For example, save them to a database, send to another API, etc.

            db.query('INSERT INTO sun_planet.spc_property SET ?', { title, prop_id, picture, description, prop_type, category, action, prop_status, price, location });
            res.redirect('/user/dashboard')
        });

    } catch (error) {
        console.log('Property Form Error :', error)
    }

}




// To delete a property content


const deleteProp = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
          
            // Perform the deletion
            const sql = `DELETE FROM sun_planet.spc_property WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                   
                    return res.status(500).send('Error deleting Property');
                }
                res.redirect('/admin/props')
            });

            
        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Property')
    }
};



module.exports = { oneProp, oneAdProp, allProp, allAdProp, deleteProp, createProp, allLeaseProp, allSaleProp, allRentProp, allShortProp, allResProp, allComProp }
