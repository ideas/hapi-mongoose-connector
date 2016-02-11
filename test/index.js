'use strict';

// Load external modules
const Hapi = require('hapi');
const Lab = require('lab');
const Mongoose = require('mongoose');

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

      server.stop(() => {
        expect(Mongoose.connection.readyState).to.equal(0);
        server.stop(done);
      });
    });
  });
});
