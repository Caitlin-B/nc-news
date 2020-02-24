const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./routes/api.router');
const {
  handleCustomErrors,
  handleError22P02,
  handleError23502,
  handleError42703,
  handleError23503
} = require('./errors');

app.use(express.json());
app.use(cors());
app.use('/api', apiRouter);
app.all('/*', (req, res, next) => next({ status: 404, msg: 'Not found' }));

app.use(handleCustomErrors);
app.use(handleError22P02);
app.use(handleError23502);
app.use(handleError42703);
app.use(handleError23503);

module.exports = app;
