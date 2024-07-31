const express = require('express');
const routes = require('./routes');
const { errorHandler } = require('./middleware');
var cors = require('cors')
const startApp = () => {
  const app = express();
  // Configure CORS
  app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
  }));

  app.use(express.json());
  app.use('/api', routes);

  app.get('/', (req, res) => {
    console.log("Home-api Hit!!!!!!!");
    res.send('<h1>Hello Home Route</h1>');
  });
  
  app.use(errorHandler);

  return app;
};

module.exports = startApp;
