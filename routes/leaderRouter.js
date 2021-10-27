const express=require("express")
const bodyparser=require("body-parser")

const leaderRouter=express.Router()
leaderRouter.use(bodyparser.json())

leaderRouter.route("/")
.all((req,res,next)=>{
    res.statusCode=200
    res.setHeader("Content-Type","text/plain")

    next()
})
.get((req,res,next)=>{
    res.end("We will send the leadership to you!")
})
.post((req,res,next)=>{
    res.end("We will add the leader to you!"+req.body.name +" and the discription : "+req.body.discription)
})
.put((req,res,next)=>{
    res.statusCode=403
    res.end("PUT command is not supported for /leadership !")
})
.delete((req,res,next)=>{
    res.end("We will delete all leadership for you !")
})

leaderRouter.route("/:leaderId")
.all((req,res,next)=>{
    res.statusCode=200
    res.setHeader("Content-Type","text/plain")

    next()
})
.get((req,res,next)=>{
    res.end("We will send the "+req.params.leaderId+" leader to you!")
})
.post((req,res,next)=>{
    res.statusCode=403
    res.end("POST command is not supported for /leadership/"+req.params.leaderId)
})
.put((req,res,next)=>{
    res.write("Change on leader "+req.params.leaderId+" loading...")
    res.end("the leader has been changed the name: "+req.body.name+" and discription: "+req.body.discription)
})
.delete((req,res,next)=>{
    res.end("We will delete the "+req.params.leaderId+" leader for you !")
})

module.exports=leaderRouter