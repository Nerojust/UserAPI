/**
 * Author: Nerojust
 * Title: API for registration and Login for client
 * Date: 22/13/2020
 */

const express = require("express");
const bodyparser = require("body-parser");

var app = express();
app.use(bodyparser.json()); //accept json parameters
app.use(bodyparser.urlencoded({ extended: true })); //accept url encoded params
app.use(require("./routes/user"));

//start server
var server = app.listen(3000, (err, res) => {
  var host = server.address().address;
  var port = server.address().port;
  if (!err) {
    console.log("listening at http://%s:%s", host, port);
  } else {
    console.log(err);
  }
});
