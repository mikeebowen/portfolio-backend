'use strict';
/**
 * @module User model
 */

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  displayName: String,
  userName: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    familyName: String,
    givenName: String
  },
  basic: {
    email: {
      type: String,
      unique: true
    },
    password: String
  },
  contentItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContentItem'
  }]
});

userSchema.pre('save', function (next) {
  const pw = this.basic.password;
  delete this.basic.password;
  const user = this;
  
  bcrypt.hash(pw, 10)
    .then(hash => {
      user.basic.password = hash;
      next();
    })
    .catch(error => next(error));
});

/**
 * @method checkPassword
 * checks a users password against the hash stored in the database with bcrypt
 * @param {string} pw - the password to be checked
 * @param {function} callback - a callback function to be called with either the response from the comparison or an error
 */

userSchema.methods.checkPassword = function (pw, callback) {
  bcrypt.compare(pw, this.basic.password)
    .then((res) => callback(null, res))
    .catch((error) => callback(error));
};

module.exports = mongoose.model('User', userSchema);