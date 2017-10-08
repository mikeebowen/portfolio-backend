'use strict';

const User = require('../models/User');

function postUser (req, res, next) {
  if (!req.body || !req.body.user || !req.body.user.userName || !req.body.user.password || !req.body.user.email) {
    req.responseData = {
      data: {
        type: 'Message',
        attributes: {
          message: 'request called with invalid parameters'
        }
      },
      'status': 417
    };
    next();
  } else {

    User.findOne({ $or: [ { userName: req.body.user.userName }, { email: req.body.user.email } ] }, (error, foundUser) => {
      if (error) {
        next(error);
      } else if (foundUser) {
        req.responseData = {
          data: {
            type: 'Message',
            attributes: {
              message: `${req.body.user.userName} is already a user name in our database, please try a different user name`
            }
          },
          'status': 409
        };
        next();
      } else {
        const newUser = {
          userName: req.body.user.userName,
          email: req.body.user.email,
          password: req.body.user.password
        };

        User.create(newUser, (error, createdUser) => {
          if (error) next(error);

          req.responseData = {
            data: {
              type: 'Message',
              attributes: {
                message: `New user: ${createdUser.userName} has been created`
              }
            },
            'status': 201
          };
          next();
        });
      }

    });
  }
}

module.exports = postUser;
