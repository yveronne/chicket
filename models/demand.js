/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import mongoose, { Schema } from 'mongoose';

var promise = mongoose.connect('mongodb://localhost/chicket', {
    useMongoClient: true
});

var demandSchema = new Schema({
    chickenType: String,
    chickenSize: String,
    quantity: Number,
    publicationDate: {
        type: Date, default: Date.now
    },
    email:{
        type: String, ref:'user'
    }
});

module.exports = mongoose.model('demand', demandSchema);
