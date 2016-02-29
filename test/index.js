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

lab.describe('Connector', () => {
  lab.it('connects to the server', (done) => {
    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector,
      options: {
        uri: 'mongodb://127.0.0.1:27017/test'
      }
    };

    server.register(plugin, (err) => {
      expect(err).to.not.exist();

      const connection = server.plugins['hapi-mongoose-connector'].connection;
      expect(connection.readyState).to.equal(Mongoose.Connection.STATES.connected);

      server.stop(done);
    });
  });

  lab.it('supports the MONGODB_URL environment variable', (done) => {
    const sandbox = Sinon.sandbox.create().stub(process, 'env', {
      MONGODB_URL: 'mongodb://127.0.0.1:27017/test'
    });

    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector
    };

    server.register(plugin, (err) => {
      expect(err).to.not.exist();

      const connection = server.plugins['hapi-mongoose-connector'].connection;
      expect(connection.readyState).to.equal(Mongoose.Connection.STATES.connected);

      sandbox.restore();
      server.stop(done);
    });
  });

  lab.it('supports the MONGODB_HOST and MONGODB_PORT environment variables', (done) => {
    const sandbox = Sinon.sandbox.create().stub(process, 'env', {
      MONGODB_HOST: '127.0.0.1',
      MONGODB_PORT: '27017'
    });

    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector
    };

    server.register(plugin, (err) => {
      expect(err).to.not.exist();

      const connection = server.plugins['hapi-mongoose-connector'].connection;
      expect(connection.readyState).to.equal(Mongoose.Connection.STATES.connected);

      sandbox.restore();
      server.stop(done);
    });
  });

  lab.it('throws an error when configuration is invalid', (done) => {
    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector,
      options: {}
    };

    server.register(plugin, (err) => {
      expect(err).to.exist();
      expect(err.message).to.match(/"uri" is required/);
      server.stop(done);
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

    server.register(plugin, (err) => {
      expect(err).to.exist();
      server.stop(done);
    });
  });

  lab.it('closes the connection when server stops', (done) => {
    const server = new Hapi.Server();
    server.connection();

    const plugin = {
      register: HapiMongooseConnector,
      options: {
        uri: 'mongodb://127.0.0.1:27017/test'
      }
    };

    server.register(plugin, (err) => {
      expect(err).to.not.exist();

      server.stop((err) => {
        expect(err).to.not.exist();

        const connection = server.plugins['hapi-mongoose-connector'].connection;
        expect(connection.readyState).to.equal(Mongoose.Connection.STATES.disconnected);

        server.stop(done);
      });
    });
  });
});
