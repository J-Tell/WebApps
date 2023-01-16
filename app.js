//set up the server
const express = require( "express" );
const app = express();
const port = 8080;
const logger = require("morgan");

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.send( "<h1>Hello world!</h1>" );
    // app.use(logger("dev")); // ??
    // // define middleware that serves static resources in the public directory
    // app.use(express.static(__dirname + '/public')); // ??
} );

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
app.get( "/", ( req, res ) => {
    res.sendFile( __dirname + "/views/index.html" );
} );

// define a route for the stuff inventory page
app.get( "/list", ( req, res ) => {
    res.sendFile( __dirname + "/views/list.html" );
} );

// define a route for the item detail page
app.get( "/list/stuff", ( req, res ) => {
    res.sendFile( __dirname + "/views/stuff.html" );
} );