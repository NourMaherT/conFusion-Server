const mongoose= require("mongoose")
const schema=mongoose.Schema

const leaderSchema = new schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Leaders = mongoose.model("leader",leaderSchema)
module.exports = Leaders