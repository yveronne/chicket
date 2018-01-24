/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 import mongoose, { Schema } from 'mongoose';

var promise = mongoose.connect('mongodb://localhost/chicket', {
    useMongoClient: true
});

//Définition du schéma
var offerSchema = new Schema ({
    chickenType : String,
    chickenSize : String,
    unitPrice : Number,
    quantity : Number,
    publicationDate : {
        type : Date , default : Date.now
    },
    reductionCondition : Number,
    reductionAmount : Number
});

//Exportation du modèle
export default mongoose.model('offer', offerSchema);
