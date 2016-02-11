# Hapi Mongoose Connector

[![npm](https://img.shields.io/npm/v/@ideapod/hapi-mongoose-connector.svg)](https://www.npmjs.com/package/@ideapod/hapi-mongoose-connector)
[![Build Status](https://travis-ci.org/ideas/hapi-mongoose-connector.svg?branch=master)](https://travis-ci.org/ideas/hapi-mongoose-connector)
[![Dependency Status](https://david-dm.org/ideas/hapi-mongoose-connector.svg)](https://david-dm.org/ideas/hapi-mongoose-connector)

Mongoose connector plugin for the hapi framework.

## Installation

```
npm install --save @ideapod/hapi-mongoose-connector
```

## Usage

The plugin accepts a URI parameter to connect to the MongoDB instance. Example:

```
const Hapi = require('hapi');
const HapiMongooseConnector = require('hapi-mongoose-connector');

const server = new Hapi.Server();
server.connection();

const plugin = {
  register: HapiMongooseConnector,
  options: {
    uri: 'mongodb://127.0.0.1:27017/test'
  }
};

server.register(plugin, (err) => {
  // ...
});
```
