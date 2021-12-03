const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique : true,
        trim : true
    },
    password : {
        type:String,
        required: true,
        trim: true
    },
    initial_balance:{
        type: Number,
        required: true,
        default: 0
    },
    net_balance : {
        type: Number,
        required: true,
        default: 0
    },
    amount_credited:{
        type: Number,
        required: true,
        default: 0
    },
    amount_debited:{
        type: Number,
        required: true,
        default: 0
    },
    transactions : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    currency : {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'USD'
    }
});
module.exports = mongoose.model("User",userSchema)