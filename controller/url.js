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
    return res.render('home',{
        id:shortId,
    })
}

async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
   const result= await URL.findOne({shortId});
    return res.json({totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    })
}

module.exports={

    handleGenerateNewShortURL,
    handleGetAnalytics
}