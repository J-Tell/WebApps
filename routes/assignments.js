const DEBUG = true;

const express = require( "express" );
const db = require("../db/db_connection");
const path = require("path");
const fs = require("fs");
const {auth} = require('express-openid-connect');
const {requiresAuth} = require('express-openid-connect');

let assignmentsRouter = express.Router();

const read_stuff_all_sql = fs.readFileSync(path.join("db", "queries", "init", "read_stuff_all_sql.sql"),{encoding : "UTF-8"});

const read_subjects_all_sql = fs.readFileSync(path.join("db", "queries", "crud", "read_subjects_all_sql.sql"),{encoding : "UTF-8"});

// define a route for the stuff inventory page
assignmentsRouter.get( "/", requiresAuth(), ( req, res ) => {
    db.execute(read_stuff_all_sql, [req.oidc.user.email], (error,results) => {
        if (DEBUG) {
            console.log(error ? error : results);
        }
        if (error) {
            res.status(500).send(error); //Internal Server Error
        }
        else {
            db.execute(read_subjects_all_sql, (error2, results2) => {
                if (DEBUG) {
                    console.log(error2 ? error2 : results2);
                }
                if (error2) {
                    res.status(500).send(error2); //Internal Server Error
                }
                else {

                    res.render('list', {inventory: results, subject_list: results2});
                }
            })
        }
    })
    // res.sendFile( __dirname + "/views/list.html" );
} );

const read_item_sql = fs.readFileSync(path.join("db", "queries", "init", "read_item_sql.sql"),{encoding : "UTF-8"});

// define a route for the item detail page
assignmentsRouter.get( "/stuff/:id", requiresAuth(), ( req, res ) => {
    db.execute(read_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
        if (error) {
            res.status(500).send(error); //Internal Server Error
        }
        else if (results.length == 0) {
            res.status(404).send(`No item found with id  = '${req.params.id}'`);
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
const delete_item_sql = fs.readFileSync(path.join("db", "queries", "init", "delete_item_sql.sql"),{encoding : "UTF-8"});

assignmentsRouter.get("/stuff/:id/delete", requiresAuth(), ( req, res ) => {
    db.execute(delete_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/list");
        }
    });
})




// define a route for item UPDATE
const update_item_sql = fs.readFileSync(path.join("db", "queries", "init", "update_item_sql.sql"),{encoding : "UTF-8"});

assignmentsRouter.post("/stuff/:id", requiresAuth(), ( req, res ) => {
    console.log(req.body);
    db.execute(update_item_sql, [req.body.homework_name, req.body.assignment_date, req.body.subject_name, req.body.class_description, req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/stuff/${req.params.id}`);
        }
    });
})





// define a route for item CREATE
const create_item_sql = fs.readFileSync(path.join("db", "queries", "init", "create_item_sql.sql"),{encoding : "UTF-8"});

assignmentsRouter.post("/", requiresAuth(), ( req, res ) => {
    db.execute(create_item_sql, [req.body.homework_name, req.body.assignment_date, req.body.subject_name, req.body.class_description, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/stuff/${results.insertId}`);
        }
        // if (DEBUG)
        //     console.log(error ? error : results);
        // if (error)
        // res.status(500).send(error); //Internal Server Error
        // else {
        //     let data = { hwlist : results };
        //     res.render('assignments', data);
        // }
    });
})

// const insert_stuff_table_sql = `
//     INSERT INTO stuff
//         (item, due_date)
//     VALUES
//         (?, ?)
// `



module.exports = assignmentsRouter;