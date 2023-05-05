//set up the server
const DEBUG = true;
const express = require( "express" );
const app = express();
const port = 9145;
const logger = require("morgan");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const {auth} = require('express-openid-connect');
const {requiresAuth} = require('express-openid-connect');
const dotenv = require('dotenv');
dotenv.config();

const db = require("./db/db_connection");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configure Express to parse URL-encoded POST request bodies (forms)
app.use( express.urlencoded({ extended: false }) );


app.use(logger("dev")); // ??
// define middleware that serves static resources in the public directory
app.use(express.static(path.join(__dirname, 'public'))); // ??

app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'cdnjs.cloudflare.com'],
      }
    }
  })); 

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL 
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


app.use((req, res, next) => {
    res.locals.isLoggedIn = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;

    next();
})

// Rest of the app.use(...) middleware


// req.isAuthenticated is provided from the auth router
app.get('/authtest', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
// const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/', (req, res) => {
    res.render('index')
});

let assignmentsRouter = require("./routes/assignments.js");
app.use("/list", requiresAuth(), assignmentsRouter);

let subjectRouter = express.Router();
subjectRouter.use("/classes", requiresAuth(), subjectRouter);


app.use( express.urlencoded({ extended: false }) );

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );

// define middleware that logs all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
} );

// define a route for the default home page
// assignmentsRouter.get( "/", requiresAuth(), ( req, res ) => {
app.get( "/", requiresAuth(), ( req, res ) => {
    // res.sendFile( __dirname + "/views/index.html" );
    res.render("index");
} );