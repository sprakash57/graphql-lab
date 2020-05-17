const Mutation = {
    createUser: (parent, args, { db }, info) => {
        if (db.users.some(u => u.email === args.data.email)) throw new Error('Email already registered')
        const user = { id: Date.now().toString(), ...args.data }
        db.users.push(user);
        return user;
    },
    deleteUser: (parent, args, { db }) => {
        const user = db.users.find(u => u.id === +args.id);
        if (!user) throw new Error('Id not found');
        db.users = db.users.filter(u => u.id !== user.id);
        const deletePost = db.posts.find(p => p.author === user.id);
        db.posts = db.posts.filter(p => p.author !== user.id);
        db.comments = db.comments.filter(c => {
            if (c.postId === deletePost.id || c.author === user.id) return false;
            return true;
        });
        return user;
    },
    updateUser: (parent, args, { db }, info) => {
        let updatedUser = {};
        const { id, data } = args;
        const user = db.users.find(u => u.id === +id);
        if (user) {
            updatedUser = user;
            if (typeof data.email === 'string') {
                const emailTaken = db.users.some(u => u.email === data.email);
                if (emailTaken) throw new Error('Email already exist in the system');
                updatedUser.email = data.email;
            }
            if (typeof data.name === 'string') {
                updatedUser.name = data.name;
            }
            if (data.age !== undefined && typeof data.age === 'number') {
                updatedUser.age = data.age;
            }
            return updatedUser;
        } else {
            throw new Error('User not found');
        }
    },
    createPost: (parent, args, { db }, info) => {
        let post = {};
        if (db.users.some(u => u.id === args.data.author)) {
            post = { id: Date.now().toString(), ...args.data }
            db.posts.push(post);
        } else {
            throw new Error("User does not exist!")
        }
        return post;
    },
    updatePost: (parent, args, { db }, info) => {
        let updatedPost = {};
        const { id, data } = args;
        const post = db.posts.find(p => p.id === +id);
        if (post) {
            updatedPost = post;
            if (typeof data.title === 'string') updatedPost.title = data.title;
            if (typeof data.published === 'boolean') updatedPost.published = data.published;
            if (typeof data.body === 'string') updatedPost.body = data.body;
            return updatedPost;
        } else {
            throw new Error('Post does not exist');
        }
    },
    deletePost: (parent, args, { db }) => {
        const post = db.posts.find(p => p.id === +args.id);
        if (!post) throw new Error('Post does not exist');
        db.posts = db.posts.filter(p => p.id !== post.id);
        db.comments = db.comments.filter(c => c.postId !== post.id);
        return post;
    },
    createComment: (parent, args, { db, pubsub }) => {
        let comment = {}
        const hasAuther = db.users.some(u => u.id === +args.data.author);
        const hasPost = db.posts.some(p => p.id === +args.data.postId);
        if (hasAuther && hasPost) {
            comment = { id: Date.now().toString(), ...args.data }
        } else {
            throw new Error('Valid user and post required');
        }
        console.log(comment);
        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.postId}`, { comment });
        return comment;
    },
    updateComment: (parent, args, { db }) => {
        let updatedComment = {};
        const { id, data } = args;
        const comment = db.comments.find(c => c.id === +id);
        if (comment) {
            updatedComment = comment;
            if (typeof data.text === 'string') updatedComment.text = data.text;
            return updatedComment;
        } else {
            throw new Error('Comment does not exist');
        }
    }
}

export default Mutation;
