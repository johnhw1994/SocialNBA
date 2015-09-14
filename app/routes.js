var User = require('./models/user.js');
var Thread = require('./models/threads.js');



module.exports = function(app, passport) {


// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {

        res.render('profile.ejs', {
            user : req.user
        });
    });

     app.get('/homepage', isLoggedIn, function(req, res) {

        User.findOne({'local.email': req.user.email},function(err,user){
            //console.log("Email is " +  user.local.email);
            console.log("Name is "  +  user.local.name);
            console.log("Age is "   +  user.local.age);
            console.log("Bio is "   +  user.local.bio);
            console.log("Team is "  +  user.local.team);
            console.log("Picture is " + user.local.picture);

            console.log("User is " + req.user.local.email);

            res.render('homepage.ejs', {user:user});
            
        }); 

    });

/*
    app.get('/viewthread/:threadID',function(req,res){

        Thread.findOne({'id': req.thread.id},function(err,threadData) {

             console.log("viewThread id is "  + thread.id);

            res.render('viewthread' + req.params.id, {data:threadData});
            
        }); 

    });

*/

    app.get('/debate', isLoggedIn,function(req,res){
         res.render('debate.ejs', { message: req.flash('debateMessage') });
    })

    app.get('/createThread', isLoggedIn,function(req,res){
         res.render('createThread.ejs', { message: req.flash('debateMessage') });
    })

    app.get('/viewthread', isLoggedIn,function(req,res){

        User.findOne({'local.email': req.user.email},function(err,user){
            //console.log("Email is " +  user.local.email);
            console.log("Name is "  +  user.local.name);
            console.log("Age is "   +  user.local.age);
            console.log("Bio is "   +  user.local.bio);
            console.log("Team is "  +  user.local.team);
            console.log("Picture is " + user.local.picture);

            console.log("User is " + req.user.local.email);

            res.render('homepage.ejs', {user:user});
            
        }); 
    })

    

     

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));




        app.post('/profile-info', function(req, res) {           
            var age  = req.body.age;
            var name = req.body.firstname;
            var team = req.body.team;
            var bio  = req.body.bio;
            var picture = req.body.picture;

            //console.log("Picture string is " + req.body.picture);

            User.findOne({'local.email':req.user.email},function(err,user){
                //Sanity checks
                console.log("Testing Email " + user.local.email);
                console.log("Testing Password" + user.local.password); //should contain some hash
                console.log("Testing Age " + user.local.age); 
                console.log("Testing Team" + user.local.team); 
                console.log("Testing Bio" + user.local.bio); 
                console.log("Testing Picture " + user.local.picture);

                console.log("User is " + user);

                user.local.name = name;
                user.local.age = age;
                user.local.team = team;
                user.local.bio = bio;
                user.local.picture = picture;

               // console.log("Testing Picture2 " + picture);

                user.save(function(err){
                    if(err) return console.err(err);
                });
            });          

            res.render('profile.ejs', { message: req.flash('signupMessage') });
      });

      app.post('/debate-info', function(req, res) {  

            var title = req.body.title;
            var format = req.body.format;
            var threadID = makeid();
            console.log("Thread id is " + threadID); 

            var newThread = new Thread();
            newThread.id =  threadID;
            newThread.title = title; 
            newThread.format = format;

            console.log('New Thread id is ' + newThread.id);


            newThread.save(function(err,saved) {
                if(err) 
                    console.log('Failed to create thread');
                else
                {
                    console.log("Thread is " + saved);
                    console.log('Format is ' + format);
                    console.log('Successfully created');    
                    console.log('Successfully created ' + saved.title);  
                    console.log('Successfully created ' + saved.id);
                    console.log('Successfully created ' + saved.format);   
                }       
                console.log('Saved is ' + saved);

                res.render('viewthread.ejs', {thread:saved});       
            });
                   
            
      });
       
   

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

//generate id
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
