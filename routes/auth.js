const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('../models/User');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

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

  password = bcrypt.hashSync(password, 10);

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
              data: resp,
              status: 'error'
            });
          })
          .catch(err => {
            return res
              .status(500)
              .json({ status: 'error', message: 'Error registering user' });
          });
      }
    })
    .catch(err => {
      return res.json({ status: 'error', message: 'Error registering user' });
    });
});

// @route   POST api/v1/auth/login
// @desc    Login user
// @access  Public
Router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  errors.status = 'error';
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { SECRET_OR_KEY } = process.env;

  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      //Check password match
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {

          errors.msg = 'Unable to login, please try again';
          return res.status(400).json(errors);
        }

        if (match === false) {
          errors.password = 'Incorrect Password';

          return res.status(401).json(errors);
        }
        const payload = {
          id: user._id,
          email: user.email
        };

        //Sign token
        jwt.sign(payload, SECRET_OR_KEY, (err, token) => {
          if (err) {
            errors.msg = 'Unable To Login. Please try again';
            return res.status(400).json(errors);
          } else {
            return res.json({
              status: 'success',
              token: `Bearer ${token}`
            });
          }
        });
      });
    })
    .catch(err => {
      errors.msg = 'Unable To Login. Please try again';

      return res.status(400).json(errors);
    });
});

module.exports = Router;
