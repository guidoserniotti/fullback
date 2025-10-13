const jwt = require("jsonwebtoken");
const config = require("../utils/config");
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
    const { title, author, url, likes } = request.body;
    const user = request.user;

    const blog = new Blog({
        title: title,
        author: author,
        url: url,
        likes: likes,
        user: user.id,
    });
    try {
        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        next(error);
    }
});

blogRouter.delete("/:id", async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id);
        if (!blog) {
            return response.status(404).json({ error: "blog not found" });
        }
        const user = request.user;

        if (blog.user.toString() === user.id.toString()) {
            await Blog.findByIdAndDelete(request.params.id);
            user.blogs = user.blogs.filter(
                (id) => id.toString() !== request.params.id
            );
            await user.save();
            response.status(204).end();
        } else {
            return response
                .status(401)
                .json({ error: "user not authorized to delete this blog" });
        }
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
        response.status(200).json(updatedBlog);
    } catch (error) {
        next(error);
    }
});

module.exports = blogRouter;
