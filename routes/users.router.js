const usersRouter = require('express').Router();
const { getUser, getUsers, postUser } = require('../controllers/users.controller');

usersRouter
  .route('/')
  .get(getUsers)
  .post(postUser);

usersRouter.route('/:username').get(getUser);

module.exports = usersRouter;
