const { fetchTopics, addTopic } = require('../models/topics.model');

exports.getTopics = (req, res, next) => {
  //get all topics
  fetchTopics()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  addTopic(slug, description)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
