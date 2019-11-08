# Express Mongoose

Build API for React admin simple rest client in a project using Express and Mongoose.

## Install

```
npm install --save ra-data-simple-rest-expressjs
```

## Usage

```ts
var express = require("express");
var bodyParser = require("body-parser");
var rest = require("ra-data-simple-rest-expressjs");

var User = require("./models/User");

var app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

rest.default({
  router: app,
  route: "/user",
  model: User,
  actions: [rest.CREATE, rest.GET_LIST, rest.GET_ONE, rest.UPDATE, rest.DELETE],
  middlewares: []
});
```
