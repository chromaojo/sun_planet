
const AvoidIndex = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        
        return res.status(401).redirect('/user/dashboard');
        
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
        return res.status(401).redirect('/user/logout');
    }
};

const AdminRoleBased = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie.role === "admin"){
        return next();
        
    } else{
        return res.status(401).redirect('/user/logout');
    }
};

module.exports = {UserLoggin, AvoidIndex, AdminRoleBased}