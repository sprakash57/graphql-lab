import { GraphQLServer } from 'graphql-yoga';

const users = [{ id: 1, name: 'a', age: 25 }, { id: 2, name: 'b', email: 'askfj@akd.com' }, { id: 3, name: 'c', email: 'jjnej@dkf.com' }];
const posts = [
    { id: 10, title: 'GraphQL', published: true, author: 1 },
    { id: 11, title: 'Docker', published: false, author: 2 },
    { id: 12, title: 'Sererless', published: true, author: 2 }
]

//String, Boolean, Int, Float, ID -> 5 Scalar type(stores single value)
//Type definition or App schema -> this will document our API in playground
const typeDefs = `
    type Query {
        users: [User!]!
        me: User!
        grade(numbers: [Int!]): Float!
        posts: [Post!]!
    }

    type User {
        id: ID!
        name: String!
        email: String
        age: Int
    }

    type Post {
        id: ID,
        title: String
        published: Boolean!
        author: User!
    }
`

//Resolvers -> set of functions run for APIs
//Every resolver has 4 params -> parent, args(contains all params), ctx, info
const resolvers = {
    Query: {
        //operation arguements
        users: (parent, args, ctx, info) => users,
        me: () => ({ id: '123456', name: 'Sunny Prakash', email: '34ksadjlf@gja.com', age: null }),
        grade: (parent, args, ctx, info) => args.numbers.reduce((a, c) => a + (c / args.numbers.length), 0),
        posts: (parent, args, ctx, info) => {
            if (!args.query) return posts
            return posts.filter(p => p.title.toLowerCase().includes(args.query.toLowerCase()))
        }
    },
    Post: {
        author: (parent, args, ctx, info) => users.find(u => u.id === parent.author)
    }
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('server is running'));