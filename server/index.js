require('dotenv').config();
const express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0');

const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,   //actual secret in .env file
    resave: false,                //
    saveUnitialized: true        // always use these values
}))

app.use(passport.initialize());
app.use(passport.session());      //very important to use this order when importing passport into app --> session, initialize, session

massive(process.env.CONNECTION_STRING).then( db => {  //in .env file --> add new database in heroku and copy the uri string then add ?ssl=true to the end
    app.set('db', db);  //allows us to retrieve info from database
})   

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,                 //in order to get this info, create a new client on Auth0
    clientID: process.env.AUTH_CLIENT_ID,            //all stored in .env file
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL 
}, 
function(accessToken, refreshToken, extraParams, profile, done) { //these parameters will ALWAYS be the same
    const db = app.get('db');        //where we make db calls
   
    db.find_user([ profile.identities[0].user_id ])     //can console.log profile to find what info you need or create a breakpoint to find the same
      .then( user => {
          if (user[0]) { 
            return done(null, user[0].id)    //getting existing user id
          } 
          else {
            const user = profile._json;  
            db.create_user( [user.name, user.email, user.picture, user.identities[0].user_id] )
              .then( user => {
                  return done(null, user[0].id);
              })
          }
      })

}))

app.get('/auth', passport.authenticate('auth0')); //always pass in exactly 'auth0' string in the authenticate call
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/private', //whatever you're running the front-end on 
    failureRedirect: '/auth'
})); 
app.get('/auth/me', (req, res) => { 
    if(!req.user) {
        return res.status(404).send('User Not Found');
    } 
    else {
        return res.status(200).send(req.user);
    }
})

app.get('/auth/logout', (req, res) => {
    req.logOut(); //built-in method --> when this is hit, it will kill the session
    res.redirect(302, 'http://localhost:3000/#/') //first arg will be status code, second arg will be where we want to redirect
})

passport.serializeUser( ( id, done ) => { //id is what gets set on the current user's session
    done(null, id);   //gets called ONCE when they login and added to the session / cookie
})

passport.deserializeUser( ( id, done ) => { //gets called every time an endpoint is hit after login and will grab the user id from sessions
    app.get('db').find_current_user( [id] )
       .then( user => {
            done(null, user[0]);    //will take whatever is passed through done and put it on req object as req.user BUT only for the life of the request
       })
     
})


const PORT = 3005;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

