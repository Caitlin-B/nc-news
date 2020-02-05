const { fetchUsers } = require('../models/users.model');

exports.getUsers = (req, res, next) => {
  //get user by username
  const { username } = req.params;

  fetchUsers(username)
    .then(user => {
      res.send({ user });
    })
    .catch(next);
};
