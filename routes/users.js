var express = require('express');
var router = express.Router();
const bodyparser=require("body-parser")
const Users=require("../models/user")

router.use(bodyparser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup",(req,res,next)=>{
  Users.findOne({username:req.body.username})
  .then((user)=>{
    if(user != null){
      let err=new Error("User "+req.body.username+" is alradey existed!")
      err.status=403
      next(err)
    }
    else{
      Users.create({
        username:req.body.username,
        password:req.body.password
      })
    }
  })
  .then((user)=>{
    res.statusCode=200
    res.setHeader("Content-Type","application/json")
    res.json({status:"Regisrtation Done!",user:user})
  },(err)=>console.log(err))
  .catch((err)=> next(err))
})

router.get("/login",(req,res,next)=>{
  if(!req.session.user){
    let authHeader=req.headers.authorization
    if(!authHeader){
      let err=new Error("You are not authorized!")
  
      res.setHeader("WWW-Authenticate","Basic")
      err.status=401
      return next(err)
    }
    let auth=new Buffer.from(authHeader.split(" ")[1],"base64").toString().split(":")
    let userName=auth[0]
    let password=auth[1]

    Users.findOne({username:userName})
    .then((user)=>{
      if(user == null){
        let err=new Error("User "+req.body.username+" is alradey existed!")
        err.status=403
        return next(err)
      }
      else if(user.password !== password){
        let err=new Error("Incorrect password!")
        err.status=403
        return next(err)
      }
      else if(user.username === userName && user.password === password){
        req.session.user="authenticated"
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    })
    .catch((err)=>next(err))
  }
    else{
      res.statusCode=200
      res.setHeader("Content-Type","text/plain")
      res.end("you are alredy authenticated!")
    }
})

router.get("/logout",(req,res)=>{
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

module.exports = router;
