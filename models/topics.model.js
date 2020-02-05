const connection = require('../db/connection');

exports.fetchTopics = topic => {
  //get all topics
  return connection
    .select('*')
    .from('topics')
    .modify(query => {
      if (topic) query.where('slug', topic).first();
    }) //if no topic passed return all topics
    .then(topic => {
      if (topic === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else {
        return topic;
      }
    });
};

exports.fetchSpecificTopic = topic => {
  return connection
    .select('*')
    .from('topics')
    .where('slug', topic)
    .then(topic => {
      console.log(topic);
    });
};
