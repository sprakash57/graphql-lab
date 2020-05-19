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
    createPost: (parent, args, { db, pubsub }, info) => {
        let post = {};
        if (db.users.some(u => u.id === +args.data.author)) {
            post = { id: Date.now().toString(), ...args.data }
            db.posts.push(post);
            if (args.data.published) pubsub.publish('post', {
                post: { mutation: 'CREATED', data: post }
            });
            return post;
        } else {
            throw new Error("User does not exist!")
        }
    },
    updatePost: (parent, args, { db, pubsub }, info) => {
        let updatedPost = {};
        const { id, data } = args;
        const post = db.posts.find(p => p.id === +id);
        const originalPost = { ...post };
        if (post) {
            updatedPost = { ...post };
            if (typeof data.title === 'string') updatedPost.title = data.title;
            if (typeof data.published === 'boolean') {
                if (originalPost.published && !data.published) {
                    //deleted
                    pubsub.publish('post', {
                        post: { mutation: 'DELETED', data: originalPost }
                    })
                } else if (!originalPost.published && data.published) {
                    //created
                    pubsub.publish('post', {
                        post: { mutation: 'CREATED', data: updatedPost }
                    })
                }
                updatedPost.published = data.published
            } else if (data.published === true) {
                //updated
                pubsub.publish('post', {
                    post: { mutation: 'UPDATED', data: updatedPost }
                })
            }
            if (typeof data.body === 'string') updatedPost.body = data.body;
            return updatedPost;
        } else {
            throw new Error('Post does not exist');
        }
    },
    deletePost: (parent, args, { db, pubsub }) => {
        const post = db.posts.find(p => p.id === +args.id);
        if (!post) throw new Error('Post does not exist');
        db.posts = db.posts.filter(p => p.id !== post.id);
        db.comments = db.comments.filter(c => c.postId !== post.id);
        if (!post.published) {
            pubsub.publish('post', {
                post: { mutation: 'DELETED', data: post }
            })
        }
        return post;
    },
    createComment: (parent, args, { db, pubsub }, info) => {
        let comment = {}
        const hasAuther = db.users.some(u => u.id === +args.data.author);
        const hasPost = db.posts.some(p => p.id === +args.data.postId);
        if (hasAuther && hasPost) {
            comment = { id: Date.now().toString(), ...args.data }
        } else {
            throw new Error('Valid user and post required');
        }
        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.postId}`, { comment: { mutation: 'CREATED', data: comment } });
        return comment;
    },
    updateComment: (parent, args, { db, pubsub }) => {
        let updatedComment = {};
        const { id, data } = args;
        const comment = db.comments.find(c => c.id == id);
        if (comment) {
            updatedComment = comment;
            if (typeof data.text === 'string') updatedComment.text = data.text;
        } else {
            throw new Error('Comment does not exist');
        }
        pubsub.publish(`comment ${comment.postId}`, { comment: { mutation: 'UPDATED', data: updatedComment } });
        return updatedComment;
    },
    deleteComment: (parent, { id }, { db, pubsub }) => {
        const comment = db.comments.find(c => c.id == id);
        if (comment) {
            pubsub.publish(`comment ${comment.postId}`, { comment: { mutation: 'DELETED', data: comment } });
            db.comments = db.comments.filter(c => c.id != id);
            return comment;
        } else {
            throw new Error('Comment not found');
        }
    }
}

export default Mutation;
