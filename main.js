/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express     =   require("express");
var consign     =   require("consign");
var app         =   express();
var bodyParser  =   require("body-parser");
var path = require('path');

const PORT = 3500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

var router      =   express.Router();
app.use('/',router);

app.use( require( './routes/apiRoute.js' ) ) ;

app.listen(PORT , () => console.log ('Connecté sur le port ' +  PORT));
