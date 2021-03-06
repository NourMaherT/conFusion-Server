const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Dishes = require("../models/dishes");
const authenticate = require("../authenticate");
const cors = require('./cors');


const dishRouter=express.Router();
dishRouter.use(bodyparser.json());

dishRouter.route("/")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next)=>{
    Dishes.find(req.query)
    // .populate("comments.auther")
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(dishes);
    },(err)=>console.log(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(dish);
    },(err)=>console.log(err))
    .catch((err)=>next(err));
    
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    res.statusCode=403;
    res.end("PUT command is not supported for /dishes !");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    },(err)=>console.log(err))
    .catch((err)=>next(err));
});





dishRouter.route("/:dishId")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next)=>{
    Dishes.findById(req.params.dishId)
    // .populate("comments.auther")
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(dish);
    },(err)=>console.log(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    res.statusCode=403;
    res.end("POST command is not supported for /dishes/" + req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },
    {new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(dish);
    },(err)=>console.log(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    },(err)=>console.log(err))
    .catch((err)=>next(err));
});



module.exports = dishRouter;