module.exports = {
  mongoDB: {
    uri: process.env.MONGODB_URI || ''
  },
  sql: {},
  pg: {
    user:process.env.PG_DB_USER ,
    host:process.env.PG_DB_HOST ,
    database:process.env.PG_DB_NAME ,
    password:process.env.PG_DB_PASSWORD ,
    port: process.env.PG_DB_PORT ,
  }
};
