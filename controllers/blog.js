const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
    const blog = new Blog(request.body);
    try {
        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

blogRouter.delete("/:id", async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id);
        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

module.exports = blogRouter;
