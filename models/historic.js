/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 var mongoose    =   require("mongoose");
 mongoose.connect('mongodb://localhost:27017/chicketbd');

 var Schema =   mongoose.Schema;


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
