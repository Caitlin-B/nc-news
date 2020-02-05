const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const {
  handleCustomErrors,
  handleError22P02,
  handleError23502,
  handleError42703,
  handleError23503
} = require('./errors');

app.use(express.json());
app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handleError22P02);
app.use(handleError23502);
app.use(handleError42703);
app.use(handleError23503);

module.exports = app;
