const apiRouter = require('express').Router();
const { sendApi } = require('../controllers/api.controller');
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const { sendToken } = require('../controllers/auth.controller');

apiRouter.get('/', sendApi);

apiRouter.post('/login', sendToken);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter.all('/*', (req, res, next) =>
  next({ status: 405, msg: 'Method not found' })
);

module.exports = apiRouter;
