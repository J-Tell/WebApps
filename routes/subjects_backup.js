const DEBUG = true;

const express = require( "express" );
const db = require("../db/db_pool_promise");
const path = require("path");
const fs = require("fs");

let subjectRouter = express.Router();

const read_subjects_all_alphabet_sql = fs.readFileSync(path.join(__dirname, "db", "queries", "crud", "read_subjects_all_alphabet_sql.sql"),{encoding : "UTF-8"});

subjectRouter.get('/', requiresAuth(), (req, res) =>  {
    db.execute(read_subjects_all_alphabet_sql, [req.oidc.user.sub], (error, results) => {
    if (DEBUG) {
        console.log(error ? error : results)
    }
    if (error) {
        res.status(500).send(error);
    }
    else {
    res.render("subjects", {subject_list: results});
}
}
)})

const create_subject_sql = fs.readFileSync(path.join(__dirname, "db", "queries", "crud", "create_subject_sql.sql"),{encoding : "UTF-8"});

subjectRouter.post('/', requiresAuth(), (req, res) => {
    db.execute(create_subject_sql, [req.body.subjectName, req.oidc.user.sub], (error, results) => {
    if (DEBUG)
    console.log(error ? error : results)
    if (error) {
        res.status(500).send(error);
    }
    else {
    res.render("subjects", {subject_list: results});
}
});
})

const delete_subject_sql = fs.readFileSync(path.join(__dirname, "db", "queries", "crud", "delete_subject_sql.sql"),{encoding : "UTF-8"});

subjectRouter.post('/:id/delete', requiresAuth(), (req, res) => {
    db.execute(delete_subject_sql, [req.body.subjectName, req.oidc.user.sub], (error, results) => {
    if (DEBUG)
    console.log(error ? error : results)
    if (error) {
        if (error.code == "ER_ROW_IS_REFERENCE_2"){
            res.status(500).send("There are still assignments associated with that elecemet.");
        }
        res.status(500).send(error);
    }
    else {
    res.redirect("/subjects");
    }
});
})


module.exports = subjectRouter;