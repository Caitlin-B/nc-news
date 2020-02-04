const connection = require('../db/connection');

exports.fetchTopics = () => {
  //get all topics
  return connection.select('*').from('topics');
};
