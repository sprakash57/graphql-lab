const Post = {
    author: (parent, args, { db }, info) => db.users.find(u => u.id === parent.author),
    comments: (parent) => db.comments.filter(c => c.postId === parent.id)
}

export default Post;
