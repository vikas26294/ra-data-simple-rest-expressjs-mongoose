# Express Mongoose

Build API for [React admin simple rest client](https://github.com/marmelab/react-admin/edit/master/packages/ra-data-simple-rest) in a project using Express and Mongoose.

## Install

```
npm install --save ra-data-simple-rest-expressjs-mongoose
```

## Usage

```ts
const express = require("express");
const bodyParser = require("body-parser");
const rest = require("ra-data-simple-rest-expressjs-mongoose");

const User = require("./models/User");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));

rest.default({
  router: app,
  route: "/user",
  model: User,
  actions: [rest.CREATE, rest.GET_LIST, rest.GET_ONE, rest.UPDATE, rest.DELETE],
  middlewares: [],
  select: "+name +username -password"
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
| select      | string           | ""                                                                   | columns to select                 |
