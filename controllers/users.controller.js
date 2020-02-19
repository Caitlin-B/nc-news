const { fetchUser, fetchUsers, addUser } = require('../models/users.model');

exports.getUser = (req, res, next) => {
  //get user by username
  const { username } = req.params;

  fetchUser(username)
    .then(user => {
      res.send({ user });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.send({ users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { username, avatar_url, name, password } = req.body;

  addUser(username, avatar_url, name, password)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
