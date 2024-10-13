const db = require('../config/db');

const info = {
    name: 'Real estate plc',
    address: 'Plot 8, No Address Street, Lagos Island',
    phone: '090XXXXXXXX',
    phone1: '08098765432',
    slogan: "Making life much better by far",
    whatsapp: '0912345678'
}


const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ?`;

const notice = {
    
}



module.exports = { notice, info }