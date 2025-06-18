
const {getUser}=require("../Services/auth")
const User=require("../models/user")

function checkForAuthentication(req,res,next){
    const tokenCookie=req.cookies?.token;
    req.user=null;
    if(!tokenCookie) return next();

    const token=tokenCookie;
    const user=getUser(token);
  
    req.user=user;
    return next();
}
function restrictTo(roles=[]){
    return async function (req,res,next){
        if(!req.user) return res.redirect("/login");
        const user=await User.findOne({email:req.user.email})
        if(!user || !roles.includes(user.role)) return res.end("UnAuthorized");
        next();
    }
}
module.exports={
    checkForAuthentication,
    restrictTo
}