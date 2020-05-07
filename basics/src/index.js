import { GraphQLServer } from 'graphql-yoga';

const users = [
    { id: 1, name: 'a', age: 25, email: 'jksdajflj@kdlsf.com' },
    { id: 2, name: 'b', email: 'askfj@akd.com' },
    { id: 3, name: 'c', email: 'jjnej@dkf.com', age: 36 }
];
const posts = [
    { id: 10, title: 'GraphQL', published: true, author: 1 },
    { id: 11, title: 'Docker', published: false, author: 2 },
    { id: 12, title: 'Sererless', published: true, author: 2 }
];
const comments = [
    { id: 100, text: 'commented', author: 1, postId: 10 },
    { id: 101, text: 'i am learning graphQL', author: 2, postId: 11 },
    { id: 102, text: 'Thank you for your feedback', author: 2, postId: 10 },
    { id: 103, text: 'I would rather look somewhere else', author: 3, postId: 11 }
];

//String, Boolean, Int, Float, ID -> 5 Scalar type(stores single value)
//Type definition or App schema -> this will document our API in playground
//If any field is not a scalar type then we will hvae to write custom resolver to extract that data.
const typeDefs = `
    type Query {
        users: [User!]!
        me: User!
        posts: [Post!]!
        comments: [Comment!]!
    }

    input userInput {name: String!, email: String!, age: Int}
    input postInput {title: String!, published: Boolean!, body: String, author: ID!}
    input commentInput {text: String!, author: ID!, postId: ID!}

    type Mutation {
        createUser(data: userInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: postInput!): Post!
        createComment(data: commentInput!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID,
        title: String!
        body: String
        published: Boolean!
        author: User!
        comments: [Comment!]
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

//Resolvers -> set of functions run for APIs
//Every resolver has 4 params -> parent, args(contains all params), ctx, info
const resolvers = {
    Query: {
        //operation arguements
        users: (parent, args, ctx, info) => {
            if (!args.query) return users
            return users.filter(u => u.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        me: () => ({ id: '123456', name: 'Sunny Prakash', email: '34ksadjlf@gja.com', age: null }),
        posts: (parent, args, ctx, info) => {
            if (!args.query) return posts
            return posts.filter(p => p.title.toLowerCase().includes(args.query.toLowerCase()))
        },
        comments: (parent, args, ctx, info) => comments
    },
    Mutation: {
        createUser: (parent, args, ctx, info) => {
            if (users.some(u => u.email === args.data.email)) throw new Error('Email already registered')
            const user = { id: Date.now().toString(), ...args.data }
            users.push(user);
            return user;
        },
        createPost: (parent, args, ctx, info) => {
            let post = {};
            if (users.some(u => u.id === args.data.author)) {
                post = { id: Date.now().toString(), ...args.data }
                posts.push(post);
            } else {
                throw new Error("User does not exist!")
            }
            return post;
        },
        createComment: (parent, args) => {
            let comment = {}
            const hasAuther = users.some(u => u.id === args.data.author);
            const hasPost = posts.some(p => p.id === args.data.postId);
            if (hasAuther && hasPost) {
                comment = { id: Date.now().toString(), ...args.data }
            } else {
                throw new Error('Valid user and post required');
            }
            comments.push(comment);
            return comment;
        },
        deleteUser: (parent, args) => {
            const idx = users.findIndex(u => u.id === args.id);
            if (idx !== -1) {
                let spliced = users.splice(idx, 1);
                return spliced;
            } else {
                throw new Error('Id not found');
            }
        }
    },
    Post: {
        author: (parent, args, ctx, info) => users.find(u => u.id === parent.author),
        comments: (parent) => comments.filter(c => c.postId === parent.id)
    },
    User: {
        posts: (parent, args, ctx, info) => posts.filter(p => p.author === parent.id),
        comments: (parent, args, ctx, info) => comments.filter(c => c.author === parent.id)
    },
    Comment: {
        author: (parent, args, ctx, info) => users.find(u => u.id === parent.author),
        post: (parent) => posts.find(p => p.id === parent.postId)
    },
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('server is running'));