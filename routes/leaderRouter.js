const express=require("express")
const bodyparser=require("body-parser")
const Leaders=require("../models/leaders")
const mongoose=require("mongoose")
const authenticate = require("../authenticate")
const cors = require('./cors')


const leaderRouter=express.Router()
leaderRouter.use(bodyparser.json())

leaderRouter.route("/")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next)=>{
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(leaders)
    },err => console.log(err))
    .catch( err => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        console.log("leader created!")
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(leader)
    },err => console.log(err))
    .catch( err => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode=403
    res.end("PUT command is not supported for /leadership !")
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
        Leaders.remove({})
        .then((resp)=>{
            res.statusCode=200
            res.setHeader("Content-Type","application/json")
            res.json(resp)
        },err => console.log(err))
        .catch(err => next(err))
})

leaderRouter.route("/:leaderId")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(leader)
    },err => console.log(err))
    .catch( err => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403
    res.end("POST command is not supported for /leadership/"+req.params.leaderId)
})
.put(cors.corsWithOptions,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId,
        {
            $set:req.body
        },{new:true})
    .then((leader)=>{
        console.log("leader updated!")
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(leader)
    },err => console.log(err))
    .catch( err => next(err))
})
.delete(cors.corsWithOptions,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        console.log("Leader Deleted!")
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
    },err => console.log(err))
    .catch( err => next(err))
})

module.exports=leaderRouter