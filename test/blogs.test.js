const { test, describe, beforeEach, after } = require("node:test");
const supertest = require("supertest");
const assert = require("node:assert");
const mongoose = require("mongoose");
const listHelper = require("../utils/list_helper");
const app = require("../app");
const api = supertest(app);
const { info, error } = require("../utils/logger");

const Blog = require("../models/blog");

beforeEach(async () => {
    await Blog.deleteMany({});

    for (let blog of listHelper.blogs) {
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
});

test("dummy returns one", () => {
    const result = listHelper.dummy(listHelper.emptyBlogs);
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

describe.only("blog", () => {
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
