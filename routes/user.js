const express = require("express");
const router = express.Router();
const connect = require("../utils/config");

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  //here you can validate headers or anything you want before allowing to hit routes.

  next();
});

/**
 * register route
 */
router.post("/register", registerUser());
/**
 * Login route
 */
router.post("/login", loginUser());
/**
 * getting all users in db
 */
router.get("/users", getAllUsers());
/**
 * getting a single user from db
 */
router.get("/users/:id", getSingleUser());
/**
 * for delete a single user
 */
router.delete("/users/:id", deleteUser());

function loginUser() {
  return (req, res) => {
    var post_data = req.body;

    var user_password = post_data.password; //get password from post parameter
    var email = post_data.email;

    connect.query(
      "SELECT * FROM User WHERE email =?",
      [email],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        connect.on("error", err => {
          res.json(err);
        });
        if (result && result.length) {
          var salt = result[0].salt; //get the salt of the result gotten from db
          var encrypted_password = result[0].encrypted_password; //encrypted password from db
          //hashed
          var hashed_password = checkHashPassword(user_password, salt)
            .passwordHash;
          if (encrypted_password == hashed_password) {
            res.send(result[0]);
          } else {
            res.send("Wrong password");
          }
        } else {
          res.send("User does not exist");
        }
      }
    );
  };
}
function registerUser() {
  return function(req, res, next) {
    var post_data = req.body; //get the post parameters
    var uid = uuid.v4(); //get uuid v4
    var plain_password = post_data.password; //get password from post parameter
    var hash_data = saltHashPassword(plain_password);
    var password = hash_data.passwordHash; //get the hash value
    var salt = hash_data.salt; //get the salt
    var name = post_data.name;
    var email = post_data.email;
    connect.query("SELECT * FROM user WHERE email =?"[email], function(
      err,
      result,
      fields
    ) {
      connect.on("error", function(err) {
        console.log("[MYSQL ERROR]", err);
      });
      if (result && result.length) {
        res.json("User already exists!");
      } else {
        connect.query(
          "INSERT INTO `User`(`unique_id`, `name`, `email`, `encrypted_password`, `salt`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,NOW(),NOW())",
          [uid, name, email, password, salt],
          function(err, result, fields) {
            connect.on("error", function(err) {
              console.log("[MYSQL ERROR]", err);
              res.json("Registration error ", err);
            });
            res.json({
              code: "200",
              message: "Registration Successful"
            });
            if (err) {
              console.log(err);
            }
          }
        );
      }
    });
  };
}
function getAllUsers() {
  return (req, res, next) => {
    connect.query("SELECT * FROM User", (err, result) => {
      if (!err) {
        res.json(result);
      } else {
        res.json(err);
      }
    });
  };
}
function getSingleUser() {
  return (req, res, next) => {
    //validate it against the parameter entered by the user
    connect.query(
      "SELECT * FROM User WHERE id =?",
      [req.params.id],
      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          if (result.length > 0) {
            res.json(result);
          } else {
            res.json("No user found with this id");
          }
        }
      }
    );
  };
}
function deleteUser() {
  return (req, res, next) => {
    connect.query("SELECT * FROM User", (err, result) => {
      if (!err) {
        //save the length of entries in the database to this variable.
        var resultFromDB = result.length;
        var userIdEntered = req.params.id;
        if (userIdEntered > resultFromDB) {
          res.json("No user found with this id");
          return;
        }
        //validate it against the parameter entered by the user
        connect.query(
          "DELETE FROM User WHERE id =?",
          [userIdEntered],
          (err, result) => {
            if (!err) {
              res.json("User deleted successfully");
            } else {
              res.json(err);
              return;
            }
          }
        );
      } else {
        res.json(err);
        return;
      }
    });
  };
}


//send the whole router
module.exports = router;
