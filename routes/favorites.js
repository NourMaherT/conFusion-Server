const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const Fav=require("../models/favorites")
const authenticate = require("../authenticate")
const cors = require('./cors')


const favRouter=express.Router()
favRouter.use(bodyparser.json())

favRouter.route("/")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    Fav.findOne({userId: req.user._id})
    .populate("userId")
    .populate({path: 'dishes'})
    .exec((err,fav,next)=>{
        if(err) return next(err)
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(fav)
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Fav.findOne({userId: req.user._id})
    .then((favorite)=>{
        if(favorite === null){
            Fav.create({
                userId: req.user._id ,
                dishes: req.body
            })
            .then((favs)=>{
                res.statusCode=200
                res.setHeader("Content-Type","application/json")
                res.json(favs)
            },(err)=>console.log(err))
        }
        else{
            Fav.findOneAndUpdate({userId: req.user._id},
                { $addToSet: {"dishes": req.body}},
                {  safe: true, upsert: true},
                (err,results)=>{
                    if(err) {
                        console.log(err) 
                        return }
                    res.statusCode=200
                    res.setHeader("Content-Type","application/json")
                    res.json(results)
                })
        }
    })
})
.delete(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{
    Fav.remove({})
    .then((resp)=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
    },(err)=>console.log(err))
    .catch((err)=>next(err))
})






favRouter.route("/:dishId")
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Fav.findOne({userId: req.user._id})
    .then((favorite)=>{
        if(favorite === null){
            Fav.create({userId: req.user._id ,
                        dishes: req.params.dishId
                    })
            .then((favs)=>{
                res.statusCode=200
                res.setHeader("Content-Type","application/json")
                res.json(favs)
            },(err)=>console.log(err))
        }
        else{
            Fav.findOneAndUpdate({userId: req.user._id},
                { $addToSet: {"dishes": req.params.dishId}},
                {  safe: true, upsert: true},
                (err,results)=>{
                    if(err) {
                        console.log(err) 
                        return }
                    res.statusCode=200
                    res.setHeader("Content-Type","application/json")
                    res.json(results)
                })
        }
    })
    .catch((err)=>next(err))
})
.delete(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{
    Fav.findOneAndUpdate({userId: req.user._id},
        { $pull: {dishes: req.params.dishId}},
        { new: true })
    .then((resp)=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
    },(err)=>console.log(err))
    .catch((err)=>next(err))
})

module.exports = favRouter