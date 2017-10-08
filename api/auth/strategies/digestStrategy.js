'use strict';

const DigestStrategy = require('passport-http').DigestStrategy;
const User = require('../../users/models/User');

const digestStrategy = new DigestStrategy({ qop: 'auth' },
  function(userName, done) {
    User.findOne({ userName: userName }, (err, user) => {
      if (err) {
        return done(err);
      } else if (!user) { 
        return done(null, false); 
      } else {
        return done(null, user, user.password);
      }
    });
  });

module.exports = digestStrategy;
