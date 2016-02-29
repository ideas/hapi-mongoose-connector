# Hapi Mongoose Connector

[![npm](https://img.shields.io/npm/v/@ideapod/hapi-mongoose-connector.svg)](https://www.npmjs.com/package/@ideapod/hapi-mongoose-connector)
[![Build Status](https://travis-ci.org/ideas/hapi-mongoose-connector.svg?branch=master)](https://travis-ci.org/ideas/hapi-mongoose-connector)
[![Dependency Status](https://david-dm.org/ideas/hapi-mongoose-connector.svg)](https://david-dm.org/ideas/hapi-mongoose-connector)

Mongoose connector plugin for the hapi framework.

## Installation

```sh
npm install --save @ideapod/hapi-mongoose-connector
```

## Configuration

The plugin accepts an `options` object where:
  - `uri`: The URI to connect to the MongoDB instance.

```javascript
const plugin = {
  register: HapiMongooseConnector,
  options: {
    uri: 'mongodb://127.0.0.1:27017/test'
  }
};
```

If `options.uri` is not set, MongoDB checks the following environment variables in this order:

  - `MONGODB_URI` (required): Contains the full MongoDB URI. Example: `mongodb://127.0.0.1:27017/test`.
  - `MONGODB_HOST` (required), `MONGODB_PORT` (required), `MONGODB_DATABASE` (optional): The plugin uses these variables to construct the URI. Examples: `127.0.0.1`, `27017`, `test`.

If `options.uri` is not set and none of these environment variables are set, an error is thrown on registration.

## Usage

The plugin can be registered as a hapi plugin. Example:

```javascript
const Hapi = require('hapi');
const HapiMongooseConnector = require('@ideapod/hapi-mongoose-connector');

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

Connection is exposed and can be accessed through the `server` object:

```javascript
const connection = server.plugins['hapi-mongoose-connector'].connection;
```
