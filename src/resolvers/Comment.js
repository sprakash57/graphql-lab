const Comment = {
    author: (parent, args, { db }, info) => {
        const user = db.users.find(u => u.id === +parent.author);
        return user;
    },
    post: (parent, args, { db }) => db.posts.find(p => p.id === +parent.postId)
}

export default Comment;
