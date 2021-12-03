const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true        
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    currency:{
        type: String,
        enum:['INR','USD','EUR'],
        default:'USD'
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Transaction",TransactionSchema)