const availableEndpoints = require('../endpoints.json');

exports.sendApi = (req, res, next) => {
  res.send({ api: availableEndpoints });
};
