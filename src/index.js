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

  server.ext('onPostStop', (server, next) => {
    Mongoose.connection.close().then(next, next);
  });

  Mongoose.connect(options.uri).then(next, next);
};

exports.register.attributes = {
  name: 'hapi-mongoose-connector'
};
