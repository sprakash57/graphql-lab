const User = {
    posts: (parent, args, { db }, info) => db.posts.filter(p => p.author === parent.id),
    comments: (parent, args, { db }, info) => db.comments.filter(c => c.author === parent.id)
}

export default User;
