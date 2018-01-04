/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express     =   require("express");
var consign     =   require("consign");
var app         =   express();
var bodyParser  =   require("body-parser");

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

var router      =   express.Router();
app.use('/',router);

app.use( require( './router/apiRoute.js' ) ) ;

app.listen(PORT , () => console.log ('Connecté sur le port ' +  PORT));
