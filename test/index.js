'use strict';

// Load external modules
const Hapi = require('hapi');
const Lab = require('lab');
const Mongoose = require('mongoose');
const Sinon = require('sinon');

// Load internal modules
const HapiMongooseConnector = require('..');

// Test shortcuts
const lab = exports.lab = Lab.script();
const expect = Lab.assertions.expect;

lab.describe('Connector', { parallel: true }, () => {
  lab.it('connects to the server', () => {
    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector,
      options: {
        uri: 'mongodb://127.0.0.1:27017/test'
      }
    };

    return server.register(plugin)
      .then(() => {
        const connection = server.plugins['hapi-mongoose-connector'].connection;
        expect(connection.readyState).to.equal(Mongoose.Connection.STATES.connected);

        return server.stop;
      });
  });

  lab.it('supports the MONGODB_URL environment variable', () => {
    const sandbox = Sinon.sandbox.create().stub(process, 'env', {
      MONGODB_URL: 'mongodb://127.0.0.1:27017/test'
    });

    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector
    };

    return server.register(plugin)
      .then(() => {
        const connection = server.plugins['hapi-mongoose-connector'].connection;
        expect(connection.readyState).to.equal(Mongoose.Connection.STATES.connected);

        sandbox.restore();
        return server.stop();
      });
  });

  lab.it('supports the MONGODB_HOST and MONGODB_PORT environment variables', () => {
    const sandbox = Sinon.sandbox.create().stub(process, 'env', {
      MONGODB_HOST: '127.0.0.1',
      MONGODB_PORT: '27017'
    });

    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector
    };

    return server.register(plugin)
      .then(() => {
        const connection = server.plugins['hapi-mongoose-connector'].connection;
        expect(connection.readyState).to.equal(Mongoose.Connection.STATES.connected);

        sandbox.restore();
        return server.stop();
      });
  });

  lab.it('throws an error when MONGODB_HOST is not specified', () => {
    const sandbox = Sinon.sandbox.create().stub(process, 'env', {
      MONGODB_PORT: '27017'
    });

    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector
    };

    return server.register(plugin)
      .catch((err) => {
        expect(err.message).to.match(/"uri" is required/);

        sandbox.restore();
        return server.stop();
      });
  });

  lab.it('throws an error when MONGODB_PORT is not specified', () => {
    const sandbox = Sinon.sandbox.create().stub(process, 'env', {
      MONGODB_HOST: '127.0.0.1'
    });

    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector
    };

    return server.register(plugin)
      .catch((err) => {
        expect(err.message).to.match(/"uri" is required/);

        sandbox.restore();
        return server.stop();
      });
  });

  lab.it('throws an error when configuration is invalid', () => {
    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector,
      options: {}
    };

    return server.register(plugin)
      .catch((err) => {
        expect(err.message).to.match(/"uri" is required/);
        return server.stop();
      });
  });

  lab.it('throws an error when connection fails', (done) => {
    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector,
      options: {
        uri: 'mongodb://127.0.0.1:27020/test'
      }
    };

    return server.register(plugin)
      .catch((err) => {
        expect(err).to.exist();
        return server.stop();
      });
  });

  lab.it('closes the connection when server stops', () => {
    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector,
      options: {
        uri: 'mongodb://127.0.0.1:27017/test'
      }
    };

    return server.register(plugin)
      .then(() => server.stop())
      .then(() => {
        const connection = server.plugins['hapi-mongoose-connector'].connection;
        expect(connection.readyState).to.equal(Mongoose.Connection.STATES.disconnected);
      });
  });
});
