const express = require('express');
const path = require('path');
const app = express();
const port = 8088;
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const { AdminRoleBased, ClientRole } = require('./server/auth/auth');
const session = require('express-session');



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(cookieParser());


app.use(
    session({
        secret: `Hidden_Key`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);


app.use('/db', require('./server/config/table'));

app.use('', require('./server/routes/pages'));

app.use('/admin', AdminRoleBased, require('./server/routes/admin'));
app.use('/user', ClientRole, require('./server/routes/customer'));





app.listen(port, ()=>{
    console.log(`App Running on ${port}`);
})