const { test, describe, beforeEach, after } = require("node:test");
const supertest = require("supertest");
const assert = require("node:assert");
const mongoose = require("mongoose");
const listHelper = require("../utils/list_helper");
const app = require("../app");
const api = supertest(app);
const { info, error } = require("../utils/logger");
const bcrypt = require("bcrypt");

const Blog = require("../models/blog");
const User = require("../models/user");
const user = require("../models/user");

let token;
let userId;

beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    // Crear usuario de prueba
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = new User({
        username: "testuser",
        name: "Test User",
        passwordHash,
    });
    const savedUser = await user.save();
    userId = savedUser._id;

    // Obtener token mediante login
    const response = await api
        .post("/api/login")
        .send({ username: "testuser", password: "password123" });
    token = response.body.token;

    // Crear blogs asignados al usuario
    for (let blog of listHelper.blogs) {
        let blogObject = new Blog({
            ...blog,
            user: userId,
        });
        await blogObject.save();
    }
});

test("dummy returns one", () => {
    const result = listHelper.dummy(listHelper.listWithOneBlog);
    assert.strictEqual(result, 1);
});

describe("total likes", () => {
    test("when list has only one blog, equals the likes of that", () => {
        const result = listHelper.totalLikes(listHelper.listWithOneBlog);
        assert.strictEqual(result, 5);
    });

    test("of an empty list is zero", () => {
        const result = listHelper.totalLikes(listHelper.emptyBlogs);
        assert.strictEqual(result, 0);
    });

    test("of a bigger list is calculated right", () => {
        const result = listHelper.totalLikes(listHelper.blogs);
        assert.strictEqual(result, 91);
    });
});

describe("blog", () => {
    test("list", async () => {
        const result = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
        assert.strictEqual(result.body.length, listHelper.blogs.length);
    });

    test("with most likes", () => {
        const mostLikedBlog = {
            author: "Michael Chan",
            likes: 30,
            title: "React patterns",
        };
        const result = listHelper.favoriteBlog(listHelper.blogs);
        assert.deepStrictEqual(result, mostLikedBlog);
    });

    test("id field exists", async () => {
        const result = await api.get("/api/blogs");
        assert.ok(result.body.filter((blog) => blog.id));
    });

    test("is posted correctly", async () => {
        const newBlog = {
            title: "My New Blog",
            author: "Guido",
            url: "http://newblog.com",
            likes: 0,
        };
        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        const blogsAtEnd = await Blog.find({});
        assert.strictEqual(blogsAtEnd.length, listHelper.blogs.length + 1);
    });

    test("with likes undefined default 0", async () => {
        const newBlog = {
            title: "Blog with no likes",
            author: "Guido",
            url: "http://newblog.com",
        };
        await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        const blogsAtEnd = await Blog.find({});
        const addedBlog = blogsAtEnd.find(
            (blog) => blog.title === "Blog with no likes"
        );
        assert.strictEqual(addedBlog.likes, 0);
    });

    test("with no title nor url throw 400", async () => {
        const newBlog = {
            author: "Guido",
        };
        const response = await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(400);
        assert.ok(response.body.error);
    });

    test("POST unauthorized if no token", async () => {
        const newBlog = {
            title: "My New Blog",
            author: "Guido",
            url: "http://newblog.com",
            likes: 0,
        };
        const blogsAtStart = await listHelper.blogsInDb();
        const response = await api
            .post("/api/blogs")
            // Sin header Authorization
            .send(newBlog)
            .expect(401);
        const blogsAtEnd = await listHelper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
        assert.strictEqual(response.body.error, "token missing");
    });

    test("POST unauthorized if token is empty", async () => {
        const newBlog = {
            title: "My New Blog",
            author: "Guido",
            url: "http://newblog.com",
            likes: 0,
        };
        const blogsAtStart = await listHelper.blogsInDb();
        const response = await api
            .post("/api/blogs")
            .set("Authorization", `Bearer `)
            .send(newBlog)
            .expect(401);
        const blogsAtEnd = await listHelper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
        assert.strictEqual(response.body.error, "token missing");
    });

    test("deleted by id", async () => {
        const blogsAtStart = await listHelper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204);

        const blogsAtEnd = await listHelper.blogsInDb();

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

        const titles = blogsAtEnd.map((r) => r.title);
        assert(!titles.includes(blogToDelete.title));
    });

    test("updated likes by id", async () => {
        const blogsAtStart = await listHelper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];
        const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200);
        assert.strictEqual(blogToUpdate.likes + 1, updatedBlog.likes);
    });
});

describe("author", () => {
    test("with most blogs", () => {
        const result = listHelper.mostBlogs(listHelper.blogs);
        assert.deepStrictEqual(result, {
            author: "Robert C. Martin",
            blogs: 3,
        });
    });

    test("with most likes", () => {
        const result = listHelper.mostLikes(listHelper.blogs);
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 32,
        });
    });
});

after(async () => {
    await mongoose.connection.close();
    info("Database connection closed");
});
