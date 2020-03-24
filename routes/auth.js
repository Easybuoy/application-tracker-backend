const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const validateRegisterInput = require('../validation/register');

const Router = express.Router();

// @route   POST api/v1/auth/register
// @desc    Register user
// @access  Public
Router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  let { password, email } = req.body;
  console.log(password)
  password = bcrypt.hashSync(password, 10);
  console.log(password);
  const user = {
    email: req.body.email,
    password
  };

  User.findOne({ email: email })
    .then(doc => {
      if (doc) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        new User(user)
          .save()
          .then(resp => {
            return res.json({
              msg: 'User Registered Successfully',
              data: resp
            });
          })
          .catch(err => {
            console.log(err);
            return res.status(500).json('Error creating user');
          });
      }
    })
    .catch(err => {
      console.log(err);
      return res.json('error');
    });
});

// @route   POST api/v1/auth/login
// @desc    Login user
// @access  Public
Router.post('/login', () => {});

module.exports = Router;
