
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
    chichenType: Joi.string().required(),
    chickenSize: Joi.string().required(),
    unitPrice: Joi.number().required(),
    quantity: Joi.number().required(),
    publicationDate: Joi.date(),
    reductionCondition: Joi.number(),
    reductionAmout: Joi.number().required()
});

const prestation_model = Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.boolean(),
    unitPrice: Joi.number().required(),
    chickenQuantity: Joi.number().required(),
    publicationDate: Joi.date(),
    reductionCondition: Joi.number(),
    reductionAmout: Joi.number(),
    duration: Joi.number()
});

const demande_model = Joi.object().keys({
    chickenType: Joi.string().required(),
    chickenSize: Joi.string().required(),
    quantity: Joi.number().required(),
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


router.get("/", function (req, res) {

    res.json({"error": false, "message": "Hello World"});

});



router.route("/users/:id")
        .get(function (req, res) { //Get the user by id

            var response = {};

            userDB.findById(req.params.id, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);

            });

        })
        .put(function (req, res) {

            var response = {};

            if (req.body) {

                var bodyTest = Joi.validate(req.body, user_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else {

                    userDB.findById(req.params.id, function (err, data) {

                        if (err) {
                            response = {"error": true, "message": err.errmsg};
                        } else {

                            data.email = req.body.email;
                            data.password = require('crypto')
                                    .createHash('sha1')
                                    .update(req.body.password)
                                    .digest('base64');
                            data.lastName = req.body.lastName;
                            data.firstName = req.boddy.firstName;
                            data.phoneNumber = req.body.phoneNumber;
                            data.city = req.body.city;
                            data.district = req.body.district;
                            data.sector = req.body.sector;

                            // save the data
                            data.save(function (err) {
                                if (err) {
                                    response = {"error": true, "message": err.errmsg};
                                } else {
                                    response = {"error": false, "message": "Data is updated for " + req.params.email};
                                }

                            });

                        }

                    });

                }

            } else {

                res.json({"Error": true, "Message": "body is empty"});
            }

            res.json(response);

        }); //update the data of the user

router.route("/users")
        .get(function (req, res) { //Get all the users

            var response = {};

            userDB.find({}, function (err, data) {
                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        });

router.route("/register")
        .post(function (req, res) { //add a new user

            if (req.body) {

                var db = new userDB();
                var dbPM = new pmDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, user_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

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
                            response = {"error": true, "message": err.errmsg};
                            res.json(response);

                        } else {

                            dbPM.transactionType = "Solde de départ du compte PouletMoney";
                            dbPM.amount = 200000;
                            dbPM.date = getDateNow();
                            dbPM.previousBalance = 0;
                            dbPM.newBalance = 200000;
                            dbPM.clientID = db._id;

                            dbPM.save(function (er) {

                                if (er) {

                                    response = {"error": true, "message": er.errmsg};

                                } else {

                                    response = {"error": false, "message": "User added successfully and his balance is 200000 FCFA!"};

                                }

                                res.json(response);
                            });
                        }

                    });

                }

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });

router.route("/login")
        .post(function (req, res) {
            if (req.body) {
                var cryptPassword = require('crypto').createHash('sha1').update(req.body.password).digest('base64');

                userDB.find({"email": req.body.email, "password": cryptPassword}, function (err, data) {
                    if (err) {
                        response = {"error": true, "message": err.errmsg};
                    } else if (data.length === 0) {
                        response = {"error": false, "message": "No user found"};
                    } else {
                        response = {"error": false, "message": "Client logged in successfully"};
                    }
                    res.json(response);
                });
            } else {
                var response = {"error": true, "message": "the body is empty"};
                res.json(response);
            }
        });

router.route("/offers/:id")
        .get(function (req, res) { //Get the offer by ID

            var response = {};

            offerDB.findById(req.params.id, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        })
        .put(function (req, res) { //update an offer

            if (req.body) {

                var db = new offerDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, offer_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else if (!req.params.id) {

                    res.json({"Error": true, "Message": "id is not defined in params!"});

                } else {


                    offerDB.findById(req.params.id, function (err, data) {

                        if (err) {

                            res.json({"Error": true, "Message": err.errmsg});

                        } else {

                            data.chichenType = req.body.chichenType;
                            data.chickenSize = req.body.chickenSize;
                            data.unitPrice = req.body.unitPrice;
                            data.quantity = req.body.quantity;
                            data.publicationDate = getDateNow();
                            data.reductionCondition = req.body.reductionCondition;
                            data.reductionAmout = req.body.reductionAmout;

                            data.save(function (err) {

                                if (err) {
                                    response = {"error": true, "message": err.errmsg};
                                    res.json(response);

                                } else {

                                    response = {"error": false, "message": "Offer updated with success!"};
                                    res.json(response);
                                }

                            });

                        }

                    });

                }

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });

router.route("/offers")
        .get(function (req, res) { //Get all the offers

            var response = {};

            offerDB.find({}, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        });

router.route("/offers/create")
        .post(function (req, res) { //add a new offer

            if (req.body) {

                var db = new offerDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, offer_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else {

                    db.chichenType = req.body.chichenType;
                    db.chickenSize = req.body.chickenSize;
                    db.unitPrice = req.body.unitPrice;
                    db.quantity = req.body.quantity;
                    db.publicationDate = getDateNow();
                    db.reductionCondition = req.body.reductionCondition;
                    db.reductionAmout = req.body.reductionAmout;

                    db.save(function (err) {

                        if (err) {
                            response = {"error": true, "message": err.errmsg};
                            res.json(response);

                        } else {

                            response = {"error": false, "message": "Offer added with success!"};
                            res.json(response);
                        }

                    });

                }

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });



router.route("/prestations/:id")
        .get(function (req, res) { //Get the prestation by ID

            var response = {};

            prestationDB.findById(req.params.id, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        })
        .put(function (req, res) { //update a prestation

            var response = {"test": "test test"};

            if (req.body) {

                var db = new prestationDB();

                var bodyTest = Joi.validate(req.body, prestation_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else if (!req.params.id) {

                    res.json({"Error": true, "Message": "ID is not defined in params!"});

                } else {

                    prestationDB.findById(req.params.id, function (err, data) {

                        if (err) {

                            res.json({"Error": true, "Message": err.errmsg});

                        } else {

                            data.name = req.body.name;
                            data.status = req.body.status;
                            data.unitPrice = req.body.unitPrice;
                            data.chickenQuantity = req.body.chickenQuantity;
                            data.date = getDateNow();
                            data.duration = req.body.duration;
                            data.reductionAmout = req.body.reductionAmout;
                            data.reductionCondition = req.body.reductionCondition;

                            data.save(function (err) {

                                if (err) {
                                    response = {"error": true, "message": err.errmsg};
                                    res.json(response);

                                } else {

                                    response = {"error": false, "message": "Prestation updated with success!"};
                                    res.json(response);
                                }

                            });

                        }

                    });

                }

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });

router.route("/prestations")
        .get(function (req, res) { //Get all the prestations

            var response = {};

            prestationDB.find({}, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        });

router.route("/prestations/create")
        .post(function (req, res) { //add a new prestation

            if (req.body) {

                var db = new prestationDB();
                var response = {"test": "test test"};

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
                    db.reductionAmout = req.body.reductionAmout;
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

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });



router.route("/demands/:id")
        .get(function (req, res) { //Get the demand by ID

            var response = {};

            demandDB.findById(req.params.id, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        })
        .put(function (req, res) { //update a demand

            if (req.body) {

                var db = new demandDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, demande_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else if (!req.params.id) {

                    res.json({"Error": true, "Message": "ID is not defined in params!"});

                } else {

                    demandDB.findById(req.params.id, function (err, data) {

                        if (err) {

                            res.json({"Error": true, "Message": err.errmsg});

                        } else {

                            data.chickenType = req.body.chickenType;
                            data.chickenSize = req.body.chickenSize;
                            data.quantity = req.body.quantity;
                            data.publicationDate = getDateNow();
                            data.email = req.body.email;

                            data.save(function (err) {

                                if (err) {
                                    response = {"error": true, "message": err.errmsg};
                                    res.json(response);

                                } else {

                                    response = {"error": false, "message": "Demand update with success!"};
                                    res.json(response);
                                }

                            });

                        }

                    });

                }

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        })
        .delete(function (req, res) {

            var response = {};

            if (req.params.id) {

                demandDB.findById(req.params.id, function (err, data) {
                    if (err) {
                        response = {"error": true, "message": err.errmsg};
                    } else {

                        demandDB.remove({"_id": req.params.id}, function (err) {
                            if (err) {
                                response = {"error": true, "message": err.errmsg};
                            } else {
                                response = {"error": true, "message": "Demand associated with " + req.params.id + " is deleted"};
                            }
                            res.json(response);
                        });
                    }
                });

            } else {

                response = {"error": true, "message": "body is empty"};
                res.json(response);
            }

        }); //delete a demands


router.route("/demands")
        .get(function (req, res) { //Get all the demands

            var response = {};

            demandDB.find({}, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        });

router.route("/demands/create")
        .post(function (req, res) { //add a new demand

            if (req.body) {

                var db = new demandDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, demande_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else {

                    db.chickenType = req.body.chickenType;
                    db.chickenSize = req.body.chickenSize;
                    db.quantity = req.body.quantity;
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

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });



router.route("/commands/:id")
        .get(function (req, res) { //Get the command by ID

            var response = {};

            commandDB.findById(req.params.id, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        })
        .put(function (req, res) { //update a command

            if (req.body) {

                var db = new commandDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, commande_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else if (!req.params.id) {

                    res.json({"Error": true, "Message": "ID is not defined in params!"});

                } else {

                    findById(req.params.id, function (err, data) {

                        if (err) {

                            res.json({"Error": true, "Message": err.errmsg});

                        } else {


                            data.quantity = req.body.quantity;
                            data.publicationDate = getDateNow();
                            data.clientID = req.body.clientID;
                            data.offerID = req.body.offerID;
                            data.prestationID = req.body.prestationID;

                            data.save(function (err) {

                                if (err) {
                                    response = {"error": true, "message": err.errmsg};
                                    res.json(response);

                                } else {

                                    response = {"error": false, "message": "Command update with success!"};
                                    res.json(response);
                                }

                            });

                        }

                    });
                }

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });

router.route("/commands")
        .get(function (req, res) { //Get all the commands

            var response = {};

            commandDB.find({}, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        })
        .post(function (req, res) { //add a new command

            if (req.body) {

                var db = new commandDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, commande_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else {

                    db.quantity = req.body.quantity;
                    db.clientID = req.body.clientID;
                    db.offerID = req.body.offerID;
                    db.prestationID = req.body.prestationID;

                    db.save(function (err) {

                        if (err) {
                            response = {"error": true, "message": err.errmsg};
                            res.json(response);

                        } else {

                            response = {"error": false, "message": "Command add with success!"};
                            res.json(response);
                        }

                    });

                }

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });



router.route("/historic/:id")
        .get(function (req, res) { //Get the historic by the client id

            var response = {};
            pmDB.findById(req.params.id, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }

                res.json(response);
            });

        });

router.route("/historic")
        .get(function (req, res) { //Get all the historic

            var response = {};

            pmDB.find({}, function (err, data) {

                if (err) {
                    response = {"error": true, "message": err.errmsg};
                } else {
                    response = {"error": false, "message": data};
                }
                res.json(response);
            });

        })
        .post(function (req, res) { //save a new historic

            if (req.body) {

                var db = new pmDB();
                var response = {"test": "test test"};

                var bodyTest = Joi.validate(req.body, HistoriquePM_model);

                if (bodyTest.error) {

                    res.json({"Error": true, "Message": bodyTest.error});

                } else {

                    db.transactionType = req.body.transactionType;
                    db.amount = req.body.amount;
                    db.date = getDateNow();
                    db.previousBalance = req.body.previousBalance;
                    db.newBalance = req.body.newBalance;
                    db.clientID = req.body.clientID;

                    db.save(function (err) {

                        if (err) {
                            response = {"error": true, "message": err.errmsg};
                            res.json(response);

                        } else {

                            response = {"error": false, "message": "Historic saved with success!"};
                            res.json(response);
                        }

                    });

                }

            } else {

                response = {"error": true, "message": "the body is empty"};
                res.json(response);

            }

        });



module.exports = router;
