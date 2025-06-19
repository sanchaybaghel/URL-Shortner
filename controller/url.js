const shortid=require("shortid");
const URL=require('../models/url')

async function handleGenerateNewShortURL(req,res) {
    const body=req.body;
   // console.log(req.body.url);
    if(req.body.url===undefined) return res.status(400).json({error:'url is required' })
    const shortId=shortid.generate();
    
    await URL.create({
        shortId:shortId,
        redirectURL:body.url,
        visitHistory:[],
    })

    // Fetch all URLs to display in the home page
    const allUrls = await URL.find({});

    // Get base URL for the application
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    return res.render('home',{
        id:shortId,
        urls:allUrls,
        baseUrl:baseUrl,
    })
}

async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result= await URL.findOne({shortId});
    
    if(!result) {
        return res.status(404).json({error: 'Short URL not found'});
    }
    
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    })
}

module.exports={

    handleGenerateNewShortURL,
    handleGetAnalytics
}
