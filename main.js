/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global passport */

var express = require("express");
var mongoose = require("mongoose");
var app = express();
const PORT = 3500;
var path = require('path');

var passport = require('passport');
var flash = require('connect-flash');

var consign = require("consign");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require('express-session');

var configDB = require('./config/database');

//Configuration
mongoose.connect(configDB.url); //Connexion à la base de données

require('./config/passport')(passport);

app.use(cookieParser());  //Lire les cookies
app.use(bodyParser());  

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

//On gère Passport
app.use(session({secret : 'vivelepoulet'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var router = express.Router();
app.use('/', router);


//Routes
//app.use(require('./routes/apiRoute.js'));
require('./routes/routes.js')(app, passport);

app.listen(PORT, () => console.log('Connecté sur le port ' + PORT));
