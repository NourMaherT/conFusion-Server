const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Fav = require("../models/favorites");
const authenticate = require("../authenticate");
const cors = require('./cors');


const favRouter = express.Router();
favRouter.use(bodyparser.json());

favRouter.route("/")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
    Fav.findOne({userId: req.user._id})
    .populate("userId")
    .populate({path: 'dishes'})
    .exec((err,fav,next)=>{
        if(err) return next(err)
        res.statusCode=200;
        res.setHeader("Content-Type","application/json");
        res.json(fav);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Fav.findOne({userId: req.user._id})
    .then((favorite)=>{
        if(favorite === null){
            Fav.create({
                userId: req.user._id ,
                dishes: req.body
            })
            .then((favs)=>{
                Fav.findById(favs._id)
                    .populate("userId")
                    .populate({path: 'dishes'})
                    .then((favs) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favs);
                    })
            },(err)=>console.log(err));
        }
        else{
            Fav.findOneAndUpdate({userId: req.user._id},
                { $addToSet: {"dishes": req.body}},
                {  safe: true, upsert: true},
                (err, favs)=>{
                    if(err) {
                        console.log(err);
                        return }
                    
                    Fav.findById(favs._id)
                    .populate("userId")
                    .populate({path: 'dishes'})
                    .then((favs) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favs);
                    })
                })
        }
    })
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Fav.remove({})
    .then((favs)=>{
        Fav.findById(favs._id)
        .populate("userId")
        .populate({path: 'dishes'})
        .then((favs) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favs);
        })
    },(err)=>console.log(err))
    .catch((err)=>next(err));
});






favRouter.route("/:dishId")
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Fav.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Fav.findOne({userId: req.user._id})
    .then((favorite)=>{
        if(favorite === null){
            Fav.create({userId: req.user._id ,
                        dishes: req.params.dishId
                    })
            .then((favs)=>{
                Fav.findById(favs._id)
                .populate("userId")
                .populate({path: 'dishes'})
                .then((favs) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favs);
                })
            },(err)=>console.log(err))
        }
        else{
            Fav.findOneAndUpdate({userId: req.user._id},
                { $addToSet: {"dishes": req.params.dishId}},
                {  safe: true, upsert: true},
                (err,favs)=>{
                    if(err) {
                        console.log(err) 
                        return }
                        Fav.findById(favs._id)
                        .populate("userId")
                        .populate({path: 'dishes'})
                        .then((favs) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favs);
                        })
                })
        }
    })
    .catch((err)=>next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Fav.findOneAndUpdate({userId: req.user._id},
        { $pull: {dishes: req.params.dishId}},
        { new: true })
    .then((favs)=>{
        Fav.findById(favs._id)
        .populate("userId")
        .populate({path: 'dishes'})
        .then((favs) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favs);
        })
    },(err)=>console.log(err))
    .catch((err)=>next(err))
});

module.exports = favRouter;