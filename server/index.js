const dotenv = require('dotenv');
dotenv.config();
const { pgClient } = require("./db/index");
const mongoose = require('mongoose');
const { database, server } = require('./config/index');
const startApp = require('./src/app');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(database.mongoDB.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('MongoDB Database connected');

    // Connect to PostgreSQL
    await pgClient.connect();
    console.log('Connected to PostgreSQL database');

    // Start the Express application
    const app = startApp();
    app.listen(server.PORT, () => {
      console.log(`Server running on port ${server.PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to database', error);
  }
};

startServer();
