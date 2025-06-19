
const express=require("express")
const URL=require("../models/url");
const { restrictTo } = require("../middleware/auth");
const router=express.Router();

router.get("/",restrictTo(["NORMAL"]),async (req,res)=>{
    const allUrls=await URL.find({})
    // Get base URL for the application
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    return res.render("home",{
        urls:allUrls,
        baseUrl:baseUrl,
    })
})

router.get('/signup',(req,res)=>{
    return res.render("signup")
})

router.get('/login',(req,res)=>{
    return res.render("login")
})


module.exports=router;
