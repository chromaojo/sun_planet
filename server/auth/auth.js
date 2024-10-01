
const AvoidIndex = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        
        return res.status(401).redirect('/login');
        
    } else{
        return next();
    }
};

const UserLoggin = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        return next();
        
    } else{
        return res.status(401).redirect('/logout');
    }
};

const AdminRoleBased = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userData = userCookie;

    if (userCookie.role === 'admin'){
        return next();
        
    } else{
        const error = 'You are not Unauthorized to access the page'
        return res.render('error',{userData, error})
        // return res.status(401).redirect('/logout');
    }
};
const ClientRole = (req, res, next)=>{  
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    const userData = userCookie;
    if (userCookie.role === 'client'){ 
        return next();
    } else{
        const error = 'You are not Unauthorized to access the page'
        return res.render('error',{userData, error})
        // return res.status(401).redirect('/logout');
    }
};

module.exports = {UserLoggin, AvoidIndex, AdminRoleBased, ClientRole}