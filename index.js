/**
 * Author: Nerojust
 * Title: API for registration and Login for client
 * Date: 22/13/2020
 */

const express = require("express");
const mysql = require("mysql");
const crypto = require("crypto");
const uuid = require("uuid");
const bodyparser = require("body-parser");

//connect to mysql
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "NodeJS_DB"
});

//password util
var genRandomString = length => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") //conver to hex format
    .slice(0, length); //return required number of characters.
};

var sha512 = (password, salt) => {
  var hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value
  };
};

function saltHashPassword(userPassword) {
  var salt = genRandomString(16); // generate random string with 16 characters to salt
  var passwordData = sha512(userPassword, salt);
  return passwordData;
}

var app = express();
app.use(bodyparser.json()); //accept json parameters
app.use(bodyparser.urlencoded({ extended: true })); //accept url encoded params

app.post("/register", function(req, res, next) {
  var post_data = req.body; //get the post parameters
  var uid = uuid.v4(); //get uuid v4
  var plain_password = post_data.password; //get passwor from post parameter
  var hash_data = saltHashPassword(plain_password);
  var password = hash_data.passwordHash; //get the hash value
  var salt = hash_data.salt; //get the salt

  var name = post_data.name;
  var email = post_data.email;

  con.query("SELECT * FROM user WHERE email =?"[email], function(
    err,
    result,
    fields
  ) {
    con.on("error", function(err) {
      console.log("[MYSQL ERROR]", err);
    });

    if (result && result.length) {
      res.json("User already exists!");
    } else {
      con.query(
        "INSERT INTO `User`( `unique_id`, `name`, `email`, `encrypted_password`, `salt`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,NOW(),NOW())",
        [uid, name, email, password, salt],
        function(err, result, fields) {
          con.on("error", function(err) {
            console.log("[MYSQL ERROR]", err);
            res.json("Registration error ", err);
          });
          res.json("Registration Successful");
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
});

// app.get("/", (req, res, next) => {
//   console.log("Password 123456");
//   var encrypt = saltHashPassword("123456");

//   console.log("Encrypted is " + encrypt.passwordHash);
//   console.log("Salt is " + encrypt.salt);
// });

//start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
