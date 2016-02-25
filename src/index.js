'use strict';

// Load external modules
const Mongoose = require('mongoose');
const Joi = require('joi');

exports.register = function (server, options, next) {
  const schema = Joi.object({
    uri: Joi.string().required()
  });

  const result = Joi.validate(options, schema);
  if (result.error) {
    return next(result.error);
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
