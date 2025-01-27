
const User = require("../models/user");

module.exports.showSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser = new User({email,username});
        const registereduser =await User.register(newUser, password);
        
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
       
    }catch(er){
        req.flash("error",er.message);
       // console.log(er);
        res.redirect("/signup")
    }
    
}

module.exports.loginForm = (req,res)=>{
    
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to WanderLust! Logged in Successfully");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out Successfully");
        res.redirect("/listings");
    });
    
}