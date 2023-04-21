const db = require("./db_connection");
/**** Delete existing table, if any ****/

const drop_stuff_table_sql = "DROP TABLE IF EXISTS `stuff`;"

db.execute(drop_stuff_table_sql);

const drop_subjects_table_sql = "DROP TABLE IF EXISTS `subjects`;"

db.execute(drop_subjects_table_sql);

/**** Create "stuff" table (again)  ****/

// const create_stuff_table_sql = `
//     CREATE TABLE stuff (
//         id INT NOT NULL AUTO_INCREMENT,
//         item VARCHAR(45) NOT NULL,
//         due_date VARCHAR(45) NOT NULL,
//         classes VARCHAR(45) NOT NULL,
//         description VARCHAR(150) NULL,
//         user_id VARCHAR (50) NULL,
//         PRIMARY KEY (id)
//     );
// `
// db.execute(create_stuff_table_sql);
const create_subjects_table_sql = `
    CREATE TABLE subjects (
        subjectId INT NOT NULL AUTO_INCREMENT,
        subjectName VARCHAR(45) NOT NULL,
        PRIMARY KEY (subjectId));
`
db.execute(create_subjects_table_sql);

const create_stuff_table_sql = `
    CREATE TABLE stuff (
        id INT NOT NULL AUTO_INCREMENT,
        item VARCHAR(45) NOT NULL,
        due_date VARCHAR(45) NOT NULL,
        description VARCHAR(150) NULL,
        user_id VARCHAR(100),
        subjectID INT
        PRIMARY KEY (id)
        INDEX stuffxsubjects (subjectId ASC),
        CONSTRAINT stuffxsubjects
            FOREIGN KEY (subjectId)
            REFERENCES subjects (subjectId)
            ON DELETE RESTRICT
            ON UPDATE CASCADE);
`

db.execute(create_stuff_table_sql);

/**** Create some sample items ****/

// const insert_stuff_table_sql = `
//     INSERT INTO stuff 
//         (item, due_date, classes, description) 
//     VALUES 
//         (?, ?, ?, ?);
// `
// db.execute(insert_stuff_table_sql, ['Chem Webassign', '1/9/23', 'Chemistry', 'ahhh chem']);

// db.execute(insert_stuff_table_sql, ['Infix Calculator', '1/6/23', 'AP CompSci', 'yayay']);

// db.execute(insert_stuff_table_sql, ['Gatsby Essay', '2/3/23', 'AmerLit', 'boooks']);

// db.execute(insert_stuff_table_sql, ['American Revolution Presentation', '2/10/23', 'History', 'boop']);

const read_stuff_table_sql = "SELECT * FROM stuff";

db.execute(read_stuff_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'stuff' initialized with:")
        console.log(results);
    }
);

db.end();