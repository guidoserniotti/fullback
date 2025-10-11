const { test, describe, beforeEach, after } = require("node:test");
const supertest = require("supertest");
const assert = require("node:assert");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const listHelper = require("../utils/list_helper");
const app = require("../app");
const api = supertest(app);
const { info } = require("../utils/logger");

const User = require("../models/user");

beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password123", 10);
    const user = new User({
        username: "testuser",
        name: "Test User",
        passwordHash,
    });
    await user.save();
});

describe("user creation", () => {
    test("fails with status 400 if username is less than 3 characters", async () => {
        const usersAtStart = await listHelper.usersInDb();

        const newUser = {
            username: "ab",
            name: "Short Username",
            password: "validpassword",
        };

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        assert.ok(result.body.error);

        const usersAtEnd = await listHelper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("fails with status 400 if username is not unique", async () => {
        const usersAtStart = await listHelper.usersInDb();

        const newUser = {
            username: "testuser", // Este username ya existe en el beforeEach
            name: "Duplicate User",
            password: "validpassword123",
        };

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        assert.ok(result.body.error);

        const usersAtEnd = await listHelper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("fails with status 400 if password is less than 3 characters", async () => {
        const usersAtStart = await listHelper.usersInDb();

        const newUser = {
            username: "validusername",
            name: "Valid Name",
            password: "ab",
        };

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        assert.ok(result.body.error);
        assert.match(
            result.body.error,
            /contraseña debe tener 3 caracteres como mínimo/i
        );

        const usersAtEnd = await listHelper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("succeeds with valid username and password", async () => {
        const usersAtStart = await listHelper.usersInDb();

        const newUser = {
            username: "newvaliduser",
            name: "New User",
            password: "validpassword123",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await listHelper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u) => u.username);
        assert.ok(usernames.includes(newUser.username));
    });
});

after(async () => {
    await mongoose.connection.close();
    info("Database connection closed");
});
