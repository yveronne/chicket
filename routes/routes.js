/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = function (app, passport){
    
    app.get('/', function(req, res){
        res.render('home', {title: 'Accueil | Chicket'});
    });
    
    app.get('/adminHome', adminLoggedIn, function(req, res){
       res.render('adminHome', {title : 'Accueil administrateur | Chicket'}); 
    });
    
    /*app.get('/', isLoggedIn , function (req, res){
        res.render('home', {title: 'Accueil | Chicket', user: req.user});
    });*/
    
    app.get('/login', function(req,res){
        
        res.render('login', {title: "Se connecter | Chicket", message : req.flash('loginMessage')});
            
    });
    
    app.get('/register', function(req, res){
        
        res.render('register', {title: "S'inscire | Chicket", message : req.flash('registerMessage')});
    });
    
    app.get('/account', isLoggedIn, function(req, res){
        res.render('account', {title : 'Mon compte | Chicket', user : req.user});
    });
    
    /*app.get('/account', !isLoggedIn, function (req, res){
        res.render('login', {title : 'Se connecter | Chicket'});
    });*/
    
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
    
    app.get('/offers/create', adminLoggedIn, function(req, res){
        res.render('createOffer', {title : 'Créer une offre | Chicket', user: req.user});
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
