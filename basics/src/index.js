import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
import Post from './resolvers/Post';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Comment,
        Post
    },
    context: {//Context will be available to all resolvers as an object
        db,
        pubsub
    }
});

server.start(() => console.log('server is running'));
