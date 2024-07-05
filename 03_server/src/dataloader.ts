import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { authors, posts, tags } from './databaseForDataloader.js';
import DataLoader from 'dataloader';

const schema = loadSchemaSync('schema.graphql', { loaders: [new GraphQLFileLoader()] });

const getAuthors = () => {
  // 実際の GraphQL サーバーで発行されることが想定されるクエリをログに出力します
  console.log(`SELECT * FROM author`);

  return authors
};

class PostsDataSource {
  private loader = new DataLoader(async (keys: number[]) => {
    // 実際の GraphQL サーバーで発行されることが想定されるクエリをログに出力します
    console.log(`SELECT * FROM post WHERE author_id IN (${keys.join(",")})`);
    const results = posts.filter(post => keys.includes(post.author_id));

    return keys.map((key: number) => results.filter(post => post.author_id === key));
  });

  async getPostsBy(author_id: number) {
    return this.loader.load(author_id);
  }
}

class TagsDataSource {
  private loader = new DataLoader(async (keys: number[]) => {
    // 実際の GraphQL サーバーで発行されることが想定されるクエリをログに出力します
    console.log(`SELECT * FROM tag WHERE post_id IN (${keys.join(",")})`);
    const results = tags.filter(tag => keys.includes(tag.post_id));

    return keys.map((key: number) => results.filter(tag => tag.post_id === key));
  });

  async getTagsBy(post_id: number) {
    return this.loader.load(post_id);
  }
}

interface ContextValue {
  dataSources: {
    posts: PostsDataSource;
    tags: TagsDataSource;
  };
}

const resolvers = {
  Query: {
    authors: () => getAuthors(),
  },
  Author: {
    posts: (parent, _, { dataSources }) => dataSources.posts.getPostsBy(parent.id),
  },
  Post: {
    tags: (parent, _, { dataSources }) => dataSources.tags.getTagsBy(parent.id),
  },
};

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const apolloServer = new ApolloServer<ContextValue>({ schema: schemaWithResolvers });
const { url } = await startStandaloneServer(apolloServer, {
  context: async () => {
    return {
      dataSources: {
        posts: new PostsDataSource(),
        tags: new TagsDataSource(),
      },
    };
  },
});

console.log(`💻 Apollo Server started: ${url}`);

