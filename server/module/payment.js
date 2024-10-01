const express = require('express');
const axios = require('axios');
const route = express.Router();
const bodyParser = require('body-parser');

// Middleware
route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: true }));

// Paystack Keys
const PAYSTACK_API_KEY = 'sk_live_c53bbe574ece48c5fceee9f5bac9fbcb7031939a';




// Route to handle payment initialization
route.post('/pay', async (req, res) => {
  const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  const { amount } = req.body;
  const email = userCookie.email 

  
  
  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', 
      { 
        email: email,
        amount: amount * 100, // Convert to kobo
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_API_KEY}`,
        },
      }
    );
    console.log('Reference is '+response.data.data.reference)
    const refree = response.data.data.reference
    res.redirect(response.data.data.authorization_url);
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Route to handle payment verification
route.get('/verify-payment/:reference', async (req, res) => {
  const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  const { reference } = req.params;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_API_KEY}`,
      },
    });
   
    const user_id = userCookie.user_id;
    const description = userCookie.surname+ ' '+ userCookie.othername  +": Payment is sucessful ";
    const payment_method = "Online Payment Via Portal"
    const status = 'completed'
    const reference_number = reference
    
    db.query('INSERT INTO sun_planet.spc_transaction SET ?', { user_id, reference_number, payment_method ,amount, status, description });

    res.redirect('/user/transactions')
    // res.status(200).json({
    //   status: 'success',
    //   data: response.data.data,
    //   // Fill in the transaction table here 
    // });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});






module.exports = route