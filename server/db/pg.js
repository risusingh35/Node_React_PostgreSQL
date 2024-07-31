const { Client } = require('pg');
const { database } = require('../config/index');
const pgClient = new Client(database.pg);

module.exports = pgClient;
