'use strict';

const express = require('express');
const app = express();
const clc = require('cli-color');
const compression = require('compression');
const config = require('config');
const cors = require('cors');
const moment = require('moment');
const mongoose = require('mongoose');
const winston = require('winston');
const bodyParser = require('body-parser');
const path = require('path');

const apiRoutes = require('./api/routes');
const catchAllEndpoint = require('./lib/catchAllEndpoint');
const configuration = config.get('configuration');
const errorHandler = require('local-error-handler');
const expressErrorHandler = require('local-express-error-handler');
const corsOptions = configuration.corsOptions;

const mongoUri = `${configuration.database.host}/${configuration.database.name}`;
const port = configuration.server.port;
const serverStartTime = moment(new Date())
  .format('LLLL');
const pathToFiles = path.join('.', 'uploads');

mongoose.Promise = Promise;
mongoose.connect(mongoUri, { useMongoClient: true })
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      winston.info(clc.cyan('successfully connected to database'));
    }
  })
  .catch((err) => {
    errorHandler(err);
  });

app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(pathToFiles));
app.use('/api', apiRoutes);
app.use('*', catchAllEndpoint);

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    winston.info(clc.yellow(`server started on port ${port} at ${serverStartTime}`));
  }
});

app.use(expressErrorHandler);
