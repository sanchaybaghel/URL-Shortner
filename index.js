const express = require("express");
const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');
const path = require('path'); 
const cookieParser=require('cookie-parser')
const {checkForAuthentication,restrictTo}=require('./middleware/auth')

const staticRoute = require('./routes/staticroute');
const userRoute=require('./routes/user')

const app = express();
app.use(cookieParser())
app.use(checkForAuthentication)

const urlRoute = require('./routes/url');
app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.use('/user',userRoute)
app.use("/url",restrictTo(["NORMAL"]) ,urlRoute);
app.use("/",staticRoute)



app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    console.log(req.params);
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now()
                    }
                }
            },
            { new: true }
        );
        if (entry) {
            console.log("Redirecting to:", entry.redirectURL);
            res.redirect(entry.redirectURL);
        } else {
            console.log("URL not found for shortId:", shortId);
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error("Error finding and updating URL:", error);
        res.status(500).send('Internal Server Error');
    }
});

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => console.log(`MongoDB connected successfully`));
const PORT = 8001;

app.set("view engine", "ejs");
app.set('views', path.resolve("./view"));
app.listen(PORT, () => console.log(`Server started at http://localhost:/${PORT}`));
