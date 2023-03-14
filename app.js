//set up the server
const express = require( "express" );
const app = express();
const port = 9145;
const logger = require("morgan");
const helmet = require("helmet");
const {auth} = require('express-openid-connect');
const {requiresAuth} = require('express-openid-connect');
const dotenv = require('dotenv');
dotenv.config();

const db = require("./db/db_connection");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");


app.use(logger("dev")); // ??
// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public')); // ??

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
app.get( "/", requiresAuth(), ( req, res ) => {
    // res.sendFile( __dirname + "/views/index.html" );
    res.render("index");
} );

const read_stuff_all_sql = `
SELECT
    id, item, due_date
FROM
    stuff
WHERE
    user_id = ?
`

// define a route for the stuff inventory page
app.get( "/list", requiresAuth(), ( req, res ) => {
    db.execute(read_stuff_all_sql, [req.oidc.user.email], (error,results) => {
        if (error) {
            res.status(500).send(error); //Internal Server Error
        }
        else {
            res.render('list', {inventory: results});
        }
    })
    // res.sendFile( __dirname + "/views/list.html" );
} );

const read_item_sql = `
SELECT
    id, item, due_date, classes, description
FROM
    stuff
WHERE
    id = ?
AND
    user_id = ?
ORDER BY
    due_date
`

// define a route for the item detail page
app.get( "/list/stuff/:id", requiresAuth(), ( req, res ) => {
    db.execute(read_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
        if (error) {
            res.status(500).send(error); //Internal Server Error
        }
        else if (results.length == 0) {
            res.status(404).send(`No item found wiht id  = '${req.params.id}'`);
        } 
        else {
            // res.send(results[0]);
            let data = results[0];
            res.render('stuff', data);
        }
    })
    // res.sendFile( __dirname + "/views/stuff.html" );
} );

// define a route for item DELETE
const delete_item_sql = `
    DELETE 
    FROM
        stuff
    WHERE
        id = ?
    AND
        user_id = ?
`
app.get("/list/stuff/:id/delete", requiresAuth(), ( req, res ) => {
    db.execute(delete_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/list");
        }
    });
})

// define a route for item UPDATE
const update_item_sql = `
    UPDATE
        stuff
    SET
        item = ?,
        due_date = ?,
        classes = ?,
        description = ?
    WHERE
        id = ?
    AND
        user_id = ?
`
app.post("/list/stuff/:id", requiresAuth(), ( req, res ) => {
    console.log(req.body);
    db.execute(update_item_sql, [req.body.homework_name, req.body.assignment_date, req.body.class_name, req.body.class_description, req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/list/stuff/${req.params.id}`);
        }
    });
})

// define a route for item CREATE
const create_item_sql = `
    INSERT INTO stuff
        (item, due_date, classes, description, user_id)
    VALUES
        (?, ?, ?, ?, ?)
`
app.post("/list", requiresAuth(), ( req, res ) => {
    db.execute(create_item_sql, [req.body.homework_name, req.body.assignment_date, req.body.class_name, req.body.class_description, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/list/stuff/${results.insertId}`);
        }
    });
})

// const insert_stuff_table_sql = `
//     INSERT INTO stuff
//         (item, due_date)
//     VALUES
//         (?, ?)
// `