/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 var mongoose    =   require("mongoose");
 mongoose.connect('mongodb://localhost:27017/chicketbd');

 var mongoSchema =   mongoose.Schema;


//Définition du schéma
var offerSchema = new Schema ({
    chichenType : String,
    chickenSize : String,
    unitPrice : Number,
    quantity : Number,
    publicationDate : {
        type : Date , default : Date.now
    },
    reductionCondition : String,
    reductionAmout : Number
});

//Exportation du modèle

module.exports = mongoose.model('offer', offerSchema);
