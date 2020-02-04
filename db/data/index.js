const ENV = process.env.NODE_ENV || 'development';
const testData = require('./test-data');
const devData = require('./development-data');

const data = {
  development: devData,
  test: testData
};

//exporting either dev or test data depending on what process.env.NODE_ENV has been set as, defaulting to dev

module.exports = data[ENV];
