/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import mongoose, { Schema } from 'mongoose';
import passport from 'passport';

var promise = mongoose.connect('mongodb://localhost/chicket', {
    useMongoClient: true
});

//Définition du schéma
var userSchema = new Schema({
    email : {
      type : String,
      unique : true
    },
    lastName : String,
    firstName : String,
    phoneNumber : String,
    city : String,
    district : String,
    sector : String,
    password : String,
    balance : Number
});

//Exportation du modèle
export default mongoose.model('user', userSchema);
