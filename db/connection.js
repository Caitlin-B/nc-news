//creating a connection in order to query the database dirctly (ie in the model)

const knex = require('knex');
const dbConfig = require('../knexfile.js');

const connection = knex(dbConfig);

module.exports = connection;
