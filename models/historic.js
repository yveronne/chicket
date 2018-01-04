/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import mongoose, { Schema } from 'mongoose';

var promise = mongoose.connect('mongodb://localhost/chicket', {
    useMongoClient: true
});
var historicSchema = new Schema({
    transactionType: String,
    amount: Number,
    date: {
        type: Date, default: Date.now
    },
    previousBalance: Number,
    newBalance: Number,
    email: {
        type:String, ref:'user'
    }
});


module.exports = mongoose.model('historic',historicSchema);
