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
  app.use(bodyParser.json());
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
    await db.connection.close();
    await mongod.stop();
  });
  it("basic", async () => {
    const app = setupServer();

    rest({
      router: app,
      route: "/users",
      model: User,
      actions: [CREATE, GET_LIST, GET_ONE, UPDATE, DELETE],
      select: "+name -username +password"
    });

    // post - add user
    let res = await request(app)
      .post("/users")
      .send({ name: "Vikas", username: "vikas26", password: "123456" });
    expect(res.status).toBe(201);
    expect(res.body.id).not.toBeNull();
    expect(res.body.name).toBe("Vikas");
    expect(res.body).not.toHaveProperty("username");
    expect(res.body.password).toBe("123456");

    // added user's id
    const { id } = res.body;

    // put - update user
    res = await request(app)
      .put(`/users/${id}`)
      .send({ name: "Balwada" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Balwada");
    expect(res.body).not.toHaveProperty("username");
    expect(res.body.password).toBe("123456");

    // get - get user
    res = await request(app).get(`/users/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Balwada");
    expect(res.body).not.toHaveProperty("username");
    expect(res.body.password).toBe("123456");

    // add new users
    await request(app)
      .post("/users")
      .send({ name: "Jeff", username: "jeff", password: "jeff1234" });
    await request(app)
      .post("/users")
      .send({ name: "Boba", username: "boba", password: "bob1234" });
    await request(app)
      .post("/users")
      .send({ name: "Steven", username: "steven", password: "steven1234" });

    // get list of users
    let users: any;
    res = await request(app)
      .get("/users")
      .query({
        sort: JSON.stringify(["name", "ASC"]),
        range: JSON.stringify([0, 2])
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    users = res.body;
    expect(users[0].name).toBe("Balwada");
    expect(users[0]).not.toHaveProperty("username");
    expect(users[0].password).toBe("123456");
    expect(users[1].name).toBe("Boba");
    expect(users[1]).not.toHaveProperty("username");
    expect(users[1].password).toBe("bob1234");

    // filter - get list of users
    res = await request(app)
      .get("/users")
      .query({
        filter: JSON.stringify({ name: "ba" })
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    users = res.body;
    expect(users[0].name).toBe("Balwada");
    expect(users[0]).not.toHaveProperty("username");
    expect(users[0].password).toBe("123456");
    expect(users[1].name).toBe("Boba");
    expect(users[1]).not.toHaveProperty("username");
    expect(users[1].password).toBe("bob1234");

    // filter - get list of users
    res = await request(app)
      .get("/users")
      .query({
        filter: JSON.stringify({ name: "ba", username: "kas" })
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    users = res.body;
    expect(users[0].name).toBe("Balwada");
    expect(users[0]).not.toHaveProperty("username");
    expect(users[0].password).toBe("123456");

    // filter - get list of users
    res = await request(app)
      .get("/users")
      .query({
        filter: JSON.stringify({ username: ["vikas26", "boba"] })
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    users = res.body;
    expect(users).toMatchObject([
      { name: "Balwada", password: "123456" },
      { name: "Boba", password: "bob1234" }
    ]);
  });
});
