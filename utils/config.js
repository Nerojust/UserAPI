const mysql = require("mysql");
//connect to mysql
var connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "NodeJS_DB"
});

module.exports = connect;
