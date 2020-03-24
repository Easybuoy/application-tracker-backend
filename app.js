const express = require('express');

const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Welcome to Application Tracker API 👋🏾' });
});

app.use('/api/v1/auth', authRoutes);

app.use((req, res, next) => {
  const error = new Error('Route Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: 'error',
    message: error.message
  });
  next();
});

const PORT = process.env.PORT || 3000;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

module.exports = app;
