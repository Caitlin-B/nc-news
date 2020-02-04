const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const { handleCustomErrors, handleError22P02 } = require('./errors');

app.use(express.json());
app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handleError22P02);

module.exports = app;
