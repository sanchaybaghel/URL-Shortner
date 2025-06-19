const User = require('../models/user');
const bcrypt = require('bcrypts');
const {setUser}=require('../Services/auth')

console.log("submit");

async function handleUserSignUp(req, res) {
    const { name, email, Password } = req.body;
    

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);

        await User.create({
            name,
            email,
            Password:hashedPassword
        });

        console.log("submitted");
        // Render the welcome page after successful sign-up and pass the name variable
        return res.render("login");
    } catch (error) {
        console.error("Error during user sign-up:", error);
        return res.status(500).send("Internal Server Error");
    }
}

async function handleUserLogin(req, res) {
    const { email, Password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.render('login', {
            error: "Invalid Username or Password"
        });
    }
    const isPasswordMatch=await bcrypt.compare(Password,user.Password);
    if(!isPasswordMatch){
        return res.render('login',{error:"incorrect Password"})
    }

   const token=setUser(user)
   res.cookie("token",token)
 //  console.log("token",req.cookies)
    return res.redirect("/");
}
module.exports = {
    handleUserSignUp,
    handleUserLogin
};