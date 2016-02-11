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

  Mongoose.createConnection(options.uri, (err) => next(err));

  server.on('stop', () => {
    Mongoose.connection.close();
  });
};

exports.register.attributes = {
  name: 'hapi-mongoose-connector'
};
