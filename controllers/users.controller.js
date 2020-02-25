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

  if(!password) {next({status:400, msg:'Bad request - password required'})}

  const bcrypt = require('bcrypt');
  const encryptedPassword = bcrypt.hashSync(password, 10);
  addUser(username, avatar_url, name, encryptedPassword)
    .then(([newUser]) => {
      const user = {
        username: newUser.username,
        avatar_url: newUser.avatar_url,
        name: newUser.name
      };

      res.status(201).send({ user });
    })
    .catch(next);
};
