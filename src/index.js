'use strict';

// Load external modules
const Mongoose = require('mongoose');
const Joi = require('joi');
const Url = require('url');

function configure(options) {
  const config = Object.assign({}, options);

  if (!config.uri) {
    if (process.env.MONGODB_URI) {
      config.uri = process.env.MONGODB_URI;
    } else if (process.env.MONGODB_HOST && process.env.MONGODB_PORT) {
      config.uri = Url.format({
        protocol: 'mongodb',
        slashes: true,
        hostname: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        pathname: process.env.MONGODB_DATABASE
      });
    }
  }

  return config;
}

function validate(config) {
  const schema = Joi.object({
    uri: Joi.string().required()
  });

  return Joi.validate(config, schema);
}

exports.register = function (server, options, next) {
  const config = configure(options);
  const result = validate(config);

  if (result.error) {
    next(result.error);
    return;
  }

  const connection = Mongoose.createConnection(result.value.uri);

  connection.on('open', next);
  connection.on('error', next);

  server.ext('onPostStop', (server, next) => {
    connection.close().then(next, next);
  });

  server.expose('connection', connection);
};

exports.register.attributes = {
  name: 'hapi-mongoose-connector'
};
