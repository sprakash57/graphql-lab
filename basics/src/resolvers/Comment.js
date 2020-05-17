const Comment = {
    author: (parent, args, { db }, info) => db.users.find(u => u.id === parent.author),
    post: (parent) => db.posts.find(p => p.id === parent.postId)
}

export default Comment;
