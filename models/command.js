/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import mongoose, { Schema } from 'mongoose';

var promise = mongoose.connect('mongodb://localhost/chicket', {
    useMongoClient: true
});

var commandSchema = new Schema({
    quantity: Number,
    clientID: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    offerID:{
        type: Schema.Types.ObjectId, ref:'offer'
    },
    prestationID:{
        type: Schema.Types.ObjectId, ref:'prestation'
    },
    publicationDate: {
        type: Date, default: Date.now
    }
});

export default mongoose.model('command', commandSchema);
