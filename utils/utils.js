const crypto = require("crypto");

//password util
var genRandomString = length => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") //convert to hex format
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
function checkHashPassword(user_password, salt) {
  var passwordData = sha512(user_password, salt);
  return passwordData;
}

module.exports = saltHashPassword;
module.exports = sha512;
module.exports = checkHashPassword;
