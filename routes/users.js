var express = require('express');
var router = express.Router();
const bodyparser=require("body-parser")
const Users=require("../models/user")
const passport = require("passport")
const authenticate = require("../authenticate")
const cors = require('./cors')


router.use(bodyparser.json())

/* GET users listing. */
router.route('/')
.get(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
  if(authenticate.verifyAdmin({user:req.user})){
    Users.find({})
    .then((users)=>{
      res.statusCode=200
      res.setHeader("Content-Type","application/json")
      res.json(users)
    },(err)=> console.log(err))
    .catch(err =>next(err))
  }
  else{
    res.statusCode=403
    res.setHeader("Content-Type","plain/text")
    res.end("Not authorized!")
  }
});

router.post("/signup",cors.corsWithOptions, (req,res,next)=>{
  Users.register(new Users({username:req.body.username})
    ,req.body.password,(err,user)=>{
      if(err){
        res.statusCode= 500
        res.setHeader("Content-Type","application/json")
        res.json({err:err})
      }
      else{
        if(req.body.firstname)
          user.firstname=req.body.firstname
        if(req.body.lastname)
          user.lastname=req.body.lastname
        user.save((err,user)=>{
          if(err){
            res.statusCode= 500
            res.setHeader("Content-Type","application/json")
            res.json({err:err})
            return
          }
          else{
            passport.authenticate("local")(req,res,() =>{
              res.statusCode= 200
              res.setHeader("Content-Type","application/json")
              res.json({success:true,status:"Registration Done!"})
            })
          }
        })
      }
    })
})

router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id:req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true,token:token, status: 'You are successfully logged in!'});
})

router.get("/logout",cors.corsWithOptions, (req,res)=>{
  if(req.session){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect("/")
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
})

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
})
module.exports = router;
