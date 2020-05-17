const Query = {
    //operation arguements
    users: (parent, args, { db }, info) => {
        if (!args.query) return db.users
        return db.users.filter(u => u.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    me: () => ({ id: '123456', name: 'Sunny Prakash', email: '34ksadjlf@gja.com', age: null }),
    posts: (parent, args, { db }, info) => {
        if (!args.query) return db.posts
        return db.posts.filter(p => p.title.toLowerCase().includes(args.query.toLowerCase()))
    },
    comments: (parent, args, { db }, info) => db.comments
}

export default Query;
