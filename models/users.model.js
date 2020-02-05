const connection = require('../db/connection');

exports.fetchUsers = username => {
  //get all users by username
  return connection
    .select('*')
    .from('users')
    .modify(query => {
      if (username) query.where('username', username).first();
    }) //if no username is passed return all usernames
    .then(user => {
      if (user === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else {
        return user;
      }
    });
};
