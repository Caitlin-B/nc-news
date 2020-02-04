const connection = require('../db/connection');

exports.fetchUsers = username => {
  //get all users by username
  return connection
    .select('*')
    .from('users')
    .where('username', username)
    .then(user => user[0]);
};
