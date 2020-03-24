const express = require('express');

const Router = express.Router();

// @route   POST api/v1/auth/register
// @desc    Register user
// @access  Public
Router.post('/register', () => {});

// @route   POST api/v1/auth/login
// @desc    Login user
// @access  Public
Router.post('/login', () => {});

module.exports = Router;
