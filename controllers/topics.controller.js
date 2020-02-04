const { fetchTopics } = require('../models/topics.model');

exports.getTopics = (req, res, next) => {
  //get all topics
  fetchTopics()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};
