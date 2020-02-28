const {
  fetchTopics,
  addTopic,
  removeTopic
} = require('../models/topics.model');

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

exports.deleteTopic = (req, res, next) => {
  const { slug } = req.params;

  removeTopic(slug)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
