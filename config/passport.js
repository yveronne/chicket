/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var LocalStrategy = require('passport-local').Strategy;

const Joi = require('joi');
const expressJoi = require('express-joi-validator');
var dateTime = require('node-datetime');

import userDB from './../models/user';
import pmDB from './../models/historic.js';

const user_model = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string(),
    city: Joi.string().required(),
    district: Joi.string().required(),
    sector: Joi.string()
});

const HistoriquePM_model = Joi.object().keys({
    clientID: Joi.string().required(),
    transactionType: Joi.string().required(),
    amount: Joi.number().required(),
    previousBalance: Joi.number().required(),
    newBalance: Joi.number().required(),
    date: Joi.date().required()
});

function getDateNow() {

    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');

    return formatted;
}

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        userDB.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email', 
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done){
        
        process.nextTick(function(){
            userDB.findOne({'email' : email}, function(err, user){
                if(err)
                    return done(err);
                
                if(user){
                    return done(null, false, req.flash('registerMessage', 'Cet email est déjà pris'));
                    
                } else{
                
                    var db = new userDB();
                    var dbPM = new pmDB();
                    var response = {"test": "test test"};

                    var bodyTest = Joi.validate(req.body, user_model);

                    if (bodyTest.error) {

                        return done(null, false, req.flash('registerMessage', 'Remplir les champs obligatoires'));
                        //throw bodyTest.error;

                    } else {

                        db.email = req.body.email;
                        db.password = require('crypto')
                                .createHash('sha1')
                                .update(req.body.password)
                                .digest('base64');

                        db.firstName = req.body.firstName;
                        db.lastName = req.body.lastName;
                        db.phoneNumber = req.body.phoneNumber;
                        db.city = req.body.city;
                        db.district = req.body.district;
                        db.sector = req.body.sector;
                        db.balance = 200000;

                        db.save(function (err) {
                            if (err) {
                                /*response = {"error": true, "message": err.errmsg};
                                //res.json(response);
                                throw err;*/
                                return done(null, false, req.flash('registerMessage', "Une erreur s'est produite"));

                            } else {

                                dbPM.transactionType = "Solde de départ du compte PouletMoney";
                                dbPM.amount = 200000;
                                dbPM.date = getDateNow();
                                dbPM.previousBalance = 0;
                                dbPM.newBalance = 200000;
                                dbPM.clientID = db._id;

                                dbPM.save(function (er) {

                                    if (er) {

                                        //response = {"error": true, "message": er.errmsg};
                                        return done(null, false, req.flash('registerMessage', "Une erreur s'est produite"));

                                    } else {

                                        response = {"error": false, "message": "User added successfully and his balance is 200000 FCFA!"};
                                        return done(null, db);
                                    }
                                });
                            }

                    });
                }
            }
        });
    });
}));

    passport.use('local-login', new LocalStrategy({
        
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    
    function (req, email, password, done){
        
        var cryptPassword = require('crypto').createHash('sha1').update(req.body.password).digest('base64');
        
        userDB.findOne({'email' : req.body.email, 'password' : cryptPassword}, function(err, user) {
                             
            if(err) return done(err);
            
            if(!user)   return done(null, false, req.flash('loginMessage', "Erreur d'authentification"));
                       
            return done(null, user);
        });
    }
    ));
};

