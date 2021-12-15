const mongoose = require("mongoose");
const schema = mongoose.Schema;


const favSchema = new schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"}] 
},{
    timestamps: true
});

const Favorite = mongoose.model("Favorite", favSchema);
module.exports = Favorite;