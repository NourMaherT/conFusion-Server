const express=require("express")
const bodyparser=require("body-parser")
const authenticate = require("../authenticate")
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
}


const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyparser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    if(authenticate.verifyAdmin({user: req.user})){
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    }
    else{
        res.statusCode=403
        res.setHeader("Content-Type","plain/text")
        res.json("Not authorized!")
    }
})
.post(authenticate.verifyUser,upload.single('imageFile'), (req, res) => {
    if(authenticate.verifyAdmin({user: req.user})){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    }
    else{
        res.statusCode=403
        res.setHeader("Content-Type","plain/text")
        res.json("Not authorized!")
    }
})
.put(authenticate.verifyUser,(req, res, next) => {
    if(authenticate.verifyAdmin({user: req.user})){
        res.statusCode = 403;
        res.end('PUT operation not supported on /imageUpload');
    }
    else{
        res.statusCode=403
        res.setHeader("Content-Type","plain/text")
        res.json("Not authorized!")
    }
})
.delete(authenticate.verifyUser, (req, res, next) => {
    if(authenticate.verifyAdmin({user: req.user})){
        res.statusCode = 403;
        res.end('DELETE operation not supported on /imageUpload');
    }
    else{
        res.statusCode=403
        res.setHeader("Content-Type","plain/text")
        res.json("Not authorized!")
    }
});

module.exports = uploadRouter;