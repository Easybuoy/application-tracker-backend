const mongoose = require('mongoose');
require('dotenv').config();
//DB config
const { DB_URI } = process.env;

//connecting to mongodb
const db = mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('mongodb connected');
  })
  .catch(err => {
    console.log('unable to connect to mongdb', err);
  });

module.exports = db;
