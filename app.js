//set up the server
const express = require( "express" );
const app = express();
const port = 8080;
const logger = require("morgan");
const db = require("./db/db_connection");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");


app.use(logger("dev")); // ??
// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public')); // ??


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
    // res.sendFile( __dirname + "/views/index.html" );
    res.render("index");
} );

const read_stuff_all_sql = `
SELECT
    id, item, due_date
FROM
    stuff
`

// define a route for the stuff inventory page
app.get( "/list", ( req, res ) => {
    db.execute(read_stuff_all_sql, (error,results) => {
        if (error) {
            res.status(500).send(error); //Internal Server Error
        }
        else {
            res.render('stuff', {inventory: results});
        }
    })
    // res.sendFile( __dirname + "/views/list.html" );
} );

const read_item_sql = `
SELECT
    item, due_date, description
FROM
    stuff
WHERE
    id = ?
`

// define a route for the item detail page
app.get( "/list/stuff/:id", ( req, res ) => {
    db.execute(read_item_sql, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); //Internal Server Error
        }
        else if (results.length == 0) {
            res.status(404).send(`No item found wiht id  = '${req.params.id}'`);
        } 
        else {
            // res.send(results[0]);
            let data = results[0];
            res.render('item', data);
        }
    })
    // res.sendFile( __dirname + "/views/stuff.html" );
} );