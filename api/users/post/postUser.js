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
        let errorMessage;
        
        if (req.body.user.userName === foundUser.userName && req.body.user.email === foundUser.email) {
          errorMessage = `Account already exists for userName: ${foundUser.userName}, email: ${foundUser.email}, please log in`;
        } else if (req.body.user.userName === foundUser.userName && req.body.user.email !== foundUser.email) {
          errorMessage = `Username ${foundUser.userName} is not available`;
        } else if (req.body.user.userName !== foundUser.userName && req.body.user.email === foundUser.email) {
          errorMessage = `Account already exists for ${foundUser.email}, please log in`;
        }
        req.responseData = {
          data: {
            type: 'Message',
            attributes: {
              message: errorMessage
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
