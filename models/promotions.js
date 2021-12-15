const mongoose= require("mongoose");
const schema=mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const currency = mongoose.Types.Currency;

const promoSchema = new schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    price: {
        type: currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const Promo = mongoose.model("Promo", promoSchema);
module.exports = Promo;