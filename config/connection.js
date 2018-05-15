// Set up MySQL connection.
var mysql = require("mysql");


var connection = mysql.createConnection({
    port: "8889",
    host: "encryptedvkdb.cm4fvld7rmid.us-west-1.rds.amazonaws.com",
    user: "root",
    password: "9Letters!",
    database: "voteknockerdb",
    multipleStatements: true,
    timeout: 60000
});



// Make connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

// Export connection for our ORM to use.
module.exports = connection;


