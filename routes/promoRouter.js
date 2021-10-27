const express=require("express")
const bodyparser=require("body-parser")

const promoRouter=express.Router()
promoRouter.use(bodyparser.json())

promoRouter.route("/")
.all((req,res,next)=>{
    res.statusCode=200
    res.setHeader("Content-Type","text/plain")

    next()
})
.get((req,res,next)=>{
    res.end("We will send the promotions to you!")
})
.post((req,res,next)=>{
    res.end("We will add the promo to you!"+req.body.name +" and the discription : "+req.body.discription)
})
.put((req,res,next)=>{
    res.statusCode=403
    res.end("PUT command is not supported for /promotions !")
})
.delete((req,res,next)=>{
    res.end("We will delete all promotions for you !")
})

promoRouter.route("/:promoId")
.all((req,res,next)=>{
    res.statusCode=200
    res.setHeader("Content-Type","text/plain")

    next()
})
.get((req,res,next)=>{
    res.end("We will send the "+req.params.promoId+" promo to you!")
})
.post((req,res,next)=>{
    res.statusCode=403
    res.end("POST command is not supported for /promotions/"+req.params.promoId)
})
.put((req,res,next)=>{
    res.write("Change on promo "+req.params.promoId+" loading...")
    res.end("the promo has been changed the name: "+req.body.name+" and discription: "+req.body.discription)
})
.delete((req,res,next)=>{
    res.end("We will delete the "+req.params.promoId+" promo for you !")
})

module.exports=promoRouter