var _ = require("lodash");
const Blog = require("../models/blog");

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 30,
        __v: 0,
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 20,
        __v: 0,
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0,
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 10,
        __v: 0,
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 9,
        __v: 0,
    },
];
const emptyBlogs = [];
const listWithOneBlog = [
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
    },
];

const dummy = (blogs) => {
    return !blogs ? 0 : 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((likesAcc, blog) => likesAcc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
    const favBlog = blogs.reduce((mostLikedBlog, actualBlog) => {
        return actualBlog.likes > mostLikedBlog.likes
            ? actualBlog
            : mostLikedBlog;
    });
    return {
        title: favBlog.title,
        author: favBlog.author,
        likes: favBlog.likes,
    };
};

const mostBlogs = (blogs) => {
    var blogsPerAuthor = _.countBy(blogs, "author");
    // console.log(blogsPerAuthor);

    var blogsToArrays = _.toPairs(blogsPerAuthor);
    var maxBlogs = _.maxBy(blogsToArrays, (o) => {
        return o[1];
    });

    // console.log({
    //     author: maxBlogs[0],
    //     blogs: maxBlogs[1],
    // });

    return {
        author: maxBlogs[0],
        blogs: maxBlogs[1],
    };
};

const mostLikes = (blogs) => {
    var blogsPerAuthor = _.groupBy(blogs, "author");

    var likesPerAuthor = _.mapValues(blogsPerAuthor, (authorBlogs) => {
        return _.sumBy(authorBlogs, "likes");
    });

    var authorsArray = _.toPairs(likesPerAuthor);

    var authorWithMostLikes = _.maxBy(authorsArray, (pair) => {
        return pair[1];
    });

    return {
        author: authorWithMostLikes[0],
        likes: authorWithMostLikes[1],
    };
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

module.exports = {
    blogs,
    emptyBlogs,
    listWithOneBlog,
    blogsInDb,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
