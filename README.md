# Express Mongoose

Build API for React admin simple rest client in a project using Express and Mongoose.

## Install

```
npm install --save ra-data-simple-rest-expressjs
```

## Usage

```ts
import express from "express";
import * as bodyParser from "body-parser";
import rest, {
  CREATE,
  GET_LIST,
  GET_ONE,
  UPDATE,
  DELETE
} from "ra-data-simple-rest-expressjs";

import { User } from "./models";

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

rest({
  router: app,
  route: "/users",
  model: User,
  actions: [CREATE, GET_LIST, GET_ONE, UPDATE, DELETE]
  middlewares: []
});
```
