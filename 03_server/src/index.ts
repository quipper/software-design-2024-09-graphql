import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { db } from './database.js';

const schema = loadSchemaSync('schema.graphql',
  { loaders: [new GraphQLFileLoader()] }
);

const resolvers = {
  Query: {
    authors: () =>
      Object.entries(db.users).map(([id, user]) => ({ id, ...user })),
  },
  Post: {
    tags: ({ tags }) => tags.map((name) => ({ name })),
  },
  Author: {
    posts: ({ id }) =>
      Object.entries(db.blogs)
        .filter(([_, post]) => post.author === id)
        .map(([id, post]) => ({ id, ...post })),
  },
};

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const apolloServer = new ApolloServer({ schema: schemaWithResolvers });
const { url } = await startStandaloneServer(apolloServer);

console.log(`💻 Apollo Server started: ${url}`);
