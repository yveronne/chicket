/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var payload = require('payload-validator');
const Joi = require('joi');
const expressJoi = require('express-joi-validator');
var dateTime = require('node-datetime');

import mongoose from 'mongoose';
import userDB from './../models/user.js';
import pmDB from './../models/historic.js';
import prestationDB from './../models/prestation.js';
import commandDB from './../models/command.js';
import demandDB from './../models/demand.js';
import offerDB from './../models/offer.js';

/**
 Get the Date now
 */
function getDateNow() {

    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');

    return formatted;
}

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

const offer_model = Joi.object().keys({
    chickenType: Joi.string().required(),
    chickenSize: Joi.string().required(),
    unitPrice: Joi.number().required(),
    quantite: Joi.number().required(),
    publicationDate: Joi.date(),
    reductionCondition: Joi.number(),
    reductionAmount: Joi.number().required()
});

const prestation_model = Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.boolean(),
    unitPrice: Joi.number().required(),
    chickenQuantity: Joi.number().required(),
    publicationDate: Joi.date(),
    reductionCondition: Joi.number(),
    reductionAmount: Joi.number(),
    duration: Joi.number()
});

const demande_model = Joi.object().keys({
    chickenType: Joi.string().required(),
    chickenSize: Joi.string().required(),
    quantite: Joi.number().required(),
    publicationDate: Joi.date(),
    clientID: Joi.string().required()
});

const commande_model = Joi.object().keys({
    clientID: Joi.string().required(),
    offerID: Joi.string().required(),
    quantity: Joi.number().required(),
    prestationID: Joi.string().required(),
    publicationDate: Joi.date()
});

const HistoriquePM_model = Joi.object().keys({
    clientID: Joi.string().required(),
    transactionType: Joi.string().required(),
    amount: Joi.number().required(),
    previousBalance: Joi.number().required(),
    newBalance: Joi.number().required(),
    date: Joi.date().required()
});


module.exports = function (app, passport){
    
    app.get('/', function(req, res){
        res.render('home', {title: 'Accueil | Chicket'});
    });
    
    app.get('/adminHome', adminLoggedIn, function(req, res){
       res.render('adminHome', {title : 'Accueil administrateur | Chicket'}); 
    });
    
    app.get('/login', function(req,res){
        
        res.render('login', {title: "Se connecter | Chicket", message : req.flash('loginMessage')});
            
    });
    
    app.get('/register', function(req, res){
        
        res.render('register', {title: "S'inscire | Chicket", message : req.flash('registerMessage')});
    });
    
    app.get('/account', isLoggedIn, function(req, res){
        res.render('account', {title : 'Mon compte | Chicket', user : req.user});
    });
    
    
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
    
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/account',
        failureRedirect : '/register',
        failureFlash : true
    }));
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/account',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    app.get('/createOffer', adminLoggedIn, function(req, res){
        res.render('createOffer', {title : 'Créer une offre | Chicket', user: req.user});
    });
    
    app.post('/createOffer', function(req, res){
        if (req.body) {

                var db = new offerDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, offer_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else {

                    db.chickenType = req.body.chickenType;
                    db.chickenSize = req.body.chickenSize;
                    db.unitPrice = req.body.unitPrice;
                    db.quantity = req.body.quantite;
                    db.publicationDate = getDateNow();
                    db.reductionCondition = req.body.reductionCondition;
                    db.reductionAmount = req.body.reductionAmount;

                    db.save(function (err) {

                        if (err) {
                            response = {"error": true, "message": err.errmsg};
                            res.json(response);

                        } else {

                            //response = {"error": false, "message": "Offer added with success!"};
                            response = {"error": false, "message": db};
                            res.json(response);                           
                        }
                    });
                }
            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }
    });
    
    app.get('/offers', function(req, res){
        
        var response = {};

            offerDB.find({}, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                    res.json(response);
                } else {
                    //response = {"error": false, "message": data};
                    var offers = [];
                    data.forEach(function(offer){
                        offers.push(offer);
                    });
                    response = {"error" : false, "message" : offers};
                    res.render('listOffers', {offers : offers});
                }
                //res.json(response);
            });
    });
    
    app.get('/adminOffers', adminLoggedIn, function(req, res){
       var response = {};

            offerDB.find({}, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                    res.json(response);
                } else {
                    //response = {"error": false, "message": data};
                    var offers = [];
                    data.forEach(function(offer){
                        offers.push(offer);
                    });
                    response = {"error" : false, "message" : offers};
                    res.render('adminListOffers', {offers : offers});
                }
                //res.json(response);
            });
    });
    
    app.get('/detailOffer', function(req, res){
        
        var response = {};
        
        offerDB.findById(req.query.offerID, function (err, offer) {
                var prestations = [];
                if (err) {
                    response = {"error": true, "message": err.errmsg};
                    res.json(response);
                } else {
                    prestationDB.find({}, function(err, data){
                        if(err) throw err;
                        else {
                            data.forEach(function(prestation){
                                prestations.push(prestation); 
                            });
                            response = {"error": false, "message": offer};
                            res.render('offerDetails', {offer : offer, prestations : prestations});
                        }
                       
                    });
                    //response = {"error": false, "message": prestations};
                    //res.render('offerDetails', {offer : offer, prestations : prestations});
                    //res.json(response);
                }
            });
    });
    
    app.get('/createDemand', isLoggedIn, function(req, res){
       res.render('createDemand', {user : req.user}); 
    });
    
    app.post('/createDemand/:clientID', isLoggedIn, function(req, res){
            var db = new demandDB();
            var response = {"test": "test test"};
            req.body.clientID = req.params.clientID;

            var bodyTest = Joi.validate(req.body, demande_model);

            if (bodyTest.error) {

                res.json({"Error": true, "Message": bodyTest.error});

            } else {

                db.chickenType = req.body.chickenType;
                db.chickenSize = req.body.chickenSize;
                db.quantity = req.body.quantite;
                db.publicationDate = getDateNow();
                db.clientID = req.body.clientID;

                db.save(function (err) {

                    if (err) {
                        response = {"error": true, "message": err.errmsg};
                        res.json(response);

                    } else {

                        response = {"error": false, "message": "Demand added with success!"};
                        res.json(response);
                    }

                });

            }
    });
    
    app.get('/prestations', adminLoggedIn, function(req, res){
       var response = {};

            prestationDB.find({}, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err};
                    res.json(response);
                } else {
                    var prestations = [];
                    data.forEach(function(prestation){
                        prestations.push(prestation);
                    });
                    response = {"error": false, "message": prestations};
                    res.render('adminListPrestations', {prestations : prestations});
                }
                
            }); 
    });
    
    app.get('/createPrestation', adminLoggedIn, function(req, res){
       res.render('adminCreatePrestation'); 
    });
    
    app.post('/createPrestation', function(req, res){
        var db = new prestationDB();
                var response = {"test": "test test"};
                req.body.status = true;

                var bodyTest = Joi.validate(req.body, prestation_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else {

                    db.name = req.body.name;
                    db.status = req.body.status;
                    db.unitPrice = req.body.unitPrice;
                    db.chickenQuantity = req.body.chickenQuantity;
                    db.date = getDateNow();
                    db.duration = req.body.duration;
                    db.reductionAmount = req.body.reductionAmount;
                    db.reductionCondition = req.body.reductionCondition;

                    db.save(function (err) {

                        if (err) {
                            response = {"error": true, "message": err.errmsg};
                            res.json(response);

                        } else {

                            response = {"error": false, "message": "Prestation added with success!"};
                            res.json(response);
                        }

                    });

                }
    });
    
    app.get('/caddy', isLoggedIn, function(req, res){
        var response = {};

            commandDB.find({"clientID": req.user._id}, function (err, data) {
                if (err) {
                    response = {"error": true, "message": err};
                    res.json(response);
                } else {
                    var commands = [];
                    var offers = [];
                    var prestations = [];
                    response = {"error": false, "message": data};
                    data.forEach(function(command){
                       commands.push(command);
                       offerDB.findById(command.offerID , function(err, offer){
                           if(err) throw err;
                           else offers.push(offer);
                       });
                       prestationDB.findById(command.prestationID , function(err, prestation){
                           if(err) throw err;
                           else prestations.push(prestation);
                       });
                    });
                    res.render('caddy', {commands : commands, offers: offers, prestations: prestations, user : req.user});
                }
            });
    });
};

//Middleware pour vérifier si l'utilisateur est déjà connecté
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

//Middleware pour vérifier s'il est connecté en tant qu'admin
function adminLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        if (req.user.email === 'yveronne@yahoo.fr')  return next();
    }
    res.redirect('/login');
}
