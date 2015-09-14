// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1450233631946547', // your App ID
        'clientSecret'    : 'd1d62a335c813283c126d374d00c00a8', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'xyIB6Wguixq6fwBiWedI7UJ0',
        'consumerSecret'     : '4S6pWrlvs2cDkB1XJNZsNeEmsvUFGaQks7XbAtVhvknhYA8fCT',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '120072463421-peift5scpjp8b6v1uph273kdnlg6d0gu.apps.googleusercontent.com',
        'clientSecret'     : '-vpzi9QFySI96JAiq5dwjioZ',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
