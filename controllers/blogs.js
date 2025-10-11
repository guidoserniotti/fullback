const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate("user", {
            username: 1,
            name: 1,
            id: 1,
        });
        response.json(blogs);
    } catch (error) {
        next(error);
    }
});

blogRouter.post("/", async (request, response, next) => {
    const creators = await User.find({});
    const randIndex = Math.floor(Math.random() * creators.length);
    const { title, author, url, likes } = request.body;
    const blog = new Blog({
        title: title,
        author: author,
        url: url,
        likes: likes,
        user: creators[randIndex].id,
    });
    try {
        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        response.status(400).json({ error: error.message });
        next(error);
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

blogRouter.put("/:id", async (request, response, next) => {
    try {
        const blogToUpdate = await Blog.findById(request.params.id);
        const updatedBlog = {
            ...blogToUpdate,
            likes: request.body.likes,
        };
        await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
            new: true,
        });
        response.status(200).json(updatedBlog).end();
    } catch (error) {
        next(error);
    }
});

module.exports = blogRouter;
