const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { setUser } = require('../Services/auth');

console.log("submit");

async function handleUserSignUp(req, res) {
    const { name, email, Password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);

        await User.create({
            name,
            email,
            Password: hashedPassword
        });

        console.log("submitted");
        // Render the login page after successful sign-up
        return res.render("login"); // Corrected path for rendering the login view
    } catch (error) {
        console.error("Error during user sign-up:", error);
        return res.status(500).send("Internal Server Error");
    }
}

async function handleUserLogin(req, res) {
    const { email, Password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', {
                error: "Invalid Username or Password"
            });
        }

        const isPasswordMatch = await bcrypt.compare(Password, user.Password);
        if (!isPasswordMatch) {
            return res.render('login', { error: "Incorrect Password" });
        }

        const token = setUser(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        return res.redirect("/");
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    handleUserSignUp,
    handleUserLogin
};