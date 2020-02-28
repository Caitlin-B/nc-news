const topicsRouter = require('express').Router();
const { getTopics, postTopic, deleteTopic } = require('../controllers/topics.controller');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)

topicsRouter.route('/:slug').delete(deleteTopic)

module.exports = topicsRouter;
