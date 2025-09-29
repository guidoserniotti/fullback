var _ = require("lodash");

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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
