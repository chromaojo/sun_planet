// require('dotenv').config();
const mysql = require('mysql'); 

// const db = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASS,
//     database: process.env.DATABASE,
//     waitForConnections: true,
//   });

const db = mysql.createConnection({
  
  host: 'localhost',
  user: 'root',
  password: 'Oluchroma234',
  database: 'bkew76jt01b1ylysxnzp',
  waitForConnections: true,

});



// const db = mysql.createConnection({
//   host: process.env.MYSQL_ADDON_HOST,
//   user: process.env.MYSQL_ADDON_USER,
//   uri: process.env.MYSQL_ADDON_URI,
//   password: process.env.MYSQL_ADDON_PASSWORD,
//   database : process.env.MYSQL_ADDON_DB,
//   port : process.env.MYSQL_ADDON_PORT,
//   waitForConnections: true,
// });
 

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Oluchroma234',
//   database: 'sun_planet',
//   waitForConnections: true,
// });


db.connect((error) => {
  if (error) {
    console.log("Database Error :", error);
  } else {
    console.log("Database Connected Successfully");
  }
});

module.exports = db;