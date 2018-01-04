/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 var mongoose    =   require("mongoose");
 mongoose.connect('mongodb://localhost:27017/chicketbd');

 var mongoSchema =   mongoose.Schema;


var prestationSchema = new Schema({
    name: String,
    unitPrice: Number,
    chickenQuantity: Number,
    duration: Number,
    publicationDate: {
        type: Date, default: Date.now
    },
    status: Boolean,
    reductionCondition: String,
    reductionAmount: Number
});


module.exports = mongoose.model('prestation', prestationSchema);
