import express from "express";
import { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import * as bodyParser from "body-parser";
import rest, { CREATE, GET_LIST, GET_ONE, UPDATE, DELETE } from "../src/index";
import { connect, User } from "./models";

const mongod = new MongoMemoryServer({
  autoStart: false
});

const setupServer = () => {
  const app = express();
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  return app;
};

let db: Mongoose;

describe("User Test", () => {
  beforeAll(async () => {
    await mongod.start();
    const url = await mongod.getConnectionString();

    db = await connect(`${url}`);
  });
  afterAll(async () => {
    // await disconnect()
    await db.connection.close();
    await mongod.stop();
  });
  it("basic", async () => {
    const app = setupServer();

    rest({
      router: app,
      route: "/users",
      model: User,
      actions: [CREATE, GET_LIST, GET_ONE, UPDATE, DELETE]
    });

    // post
    let res = await request(app)
      .post("/users")
      .send({ name: "Vikas" });
    expect(res.status).toBe(201);
    expect(res.body.id).not.toBeNull();
    expect(res.body.name).toBe("Vikas");

    const { id } = res.body;

    // put
    res = await request(app)
      .put(`/users/${id}`)
      .send({ name: "Balwada" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Balwada");

    // get
    res = await request(app).get(`/users/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Balwada");

    await request(app)
      .post("/users")
      .send({ name: "Jeff" });
    await request(app)
      .post("/users")
      .send({ name: "Bob" });
    await request(app)
      .post("/users")
      .send({ name: "Steven" });

    // get list
    res = await request(app)
      .get("/users")
      .query({
        sort: JSON.stringify(["name", "ASC"]),
        range: JSON.stringify([0, 2])
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    const users = res.body;
    expect(users[0].name).toBe("Balwada");
    expect(users[1].name).toBe("Bob");
  });
});
