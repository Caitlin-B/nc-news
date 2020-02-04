const { fetchUsers } = require('../models/users.model');

exports.getUsers = (req, res, next) => {
  //get user by username
  const { username } = req.params;

  fetchUsers(username)
    .then(user => {
      if (user === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      res.send({ user });
    })
    .catch(next);
};
