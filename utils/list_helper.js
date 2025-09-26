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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
};
