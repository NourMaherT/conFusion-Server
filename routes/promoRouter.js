const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const Promos=require("../models/promotions")

const promoRouter=express.Router()
promoRouter.use(bodyparser.json())

promoRouter.route("/")
.get((req,res,next)=>{
    Promos.find({})
    .then((promos)=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(promos)
    },err => console.log(err))
    .catch( err => next(err))
})
.post((req,res,next)=>{
    Promos.create(req.body)
    .then((promo)=>{
        console.log("Promo created!")
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(promo)
    },err => console.log(err))
    .catch( err => next(err))
    
})
.put((req,res,next)=>{
    res.statusCode=403
    res.end("PUT command is not supported for /promotions !")
})
.delete((req,res,next)=>{
    Promos.remove({})
    .then((resp)=>{
        console.log("Promo created!")
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
    },err => console.log(err))
    .catch( err => next(err))
})

promoRouter.route("/:promoId")
.get((req,res,next)=>{
    Promos.findById(req.params.promoId)
    .then((promo)=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(promo)
    },err => console.log(err))
    .catch( err => next(err))
})
.post((req,res,next)=>{
    res.statusCode=403
    res.end("POST command is not supported for /promotions/"+req.params.promoId)
})
.put((req,res,next)=>{
    Promos.findByIdAndUpdate(req.params.promoId,
        {
            $set:req.body
        },{new:true})
    .then((promo)=>{
        console.log("Promo updated!")
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(promo)
    },err => console.log(err))
    .catch( err => next(err))
})
.delete((req,res,next)=>{
    Promos.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        console.log("Promo Deleted!")
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
    },err => console.log(err))
    .catch( err => next(err))
})

module.exports=promoRouter