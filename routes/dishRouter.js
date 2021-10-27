const express=require("express")
const bodyparser=require("body-parser")


const dishRouter=express.Router()
dishRouter.use(bodyparser.json())

dishRouter.route("/")
.all((req,res,next)=>{
    res.statusCode=200
    res.setHeader("Content-Type","text/plain")

    next()
})
.get((req,res,next)=>{
    res.end("We will send the dishes to you!")
})
.post((req,res,next)=>{
    res.end("We will add the dish to you!"+req.body.name +" and the discription : "+req.body.discription)
})
.put((req,res,next)=>{
    res.statusCode=403
    res.end("PUT command is not supported for /dishes !")
})
.delete((req,res,next)=>{
    res.end("We will delete all dishes for you !")
})

dishRouter.route("/:dishId")
.all((req,res,next)=>{
    res.statusCode=200
    res.setHeader("Content-Type","text/plain")

    next()
})
.get((req,res,next)=>{
    res.end("We will send the "+req.params.dishId+" dish to you!")
})
.post((req,res,next)=>{
    res.statusCode=403
    res.end("POST command is not supported for /dishes/"+req.params.dishId)
})
.put((req,res,next)=>{
    res.write("Change on dish "+req.params.dishId+" loading...")
    res.end("the dish has been changed the name: "+req.body.name+" and discription: "+req.body.discription)
})
.delete((req,res,next)=>{
    res.end("We will delete the "+req.params.dishId+" dish for you !")
})

module.exports=dishRouter