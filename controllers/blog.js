const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogRouter.post("/", (request, response) => {
    if (!request.body.likes) {
        request.body.likes = 0;
    }
    const blog = new Blog(request.body);
    blog.save().then((result) => {
        response.status(201).json(result);
    });
});

module.exports = blogRouter;
