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

## Options:

The `default` function takes mandatory object that contain following keys:

| Property    | Type             | Default                                                              | Description                       |
| ----------- | ---------------- | -------------------------------------------------------------------- | --------------------------------- |
| router      | express instance | null                                                                 | instance of express               |
| route       | string           | ""                                                                   | api route                         |
| model       | Mongoose.Model   | null                                                                 | Mongoose model to create APIs for |
| actions     | array            | [rest.CREATE, rest.GET_LIST, rest.GET_ONE, rest.UPDATE, rest.DELETE] | apis to expose                    |
| middlewares | array            | []                                                                   | any middlewares to apply on apis  |
