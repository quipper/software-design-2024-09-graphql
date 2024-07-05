import { makeExecutableSchema } from "@graphql-tools/schema";

const db = {
  blogs: {
    1: {
      title:
        "Signed Query は GraphQL の Trusted Document の新しい実装パターンです",
      author: "YutaUra",
      body: `こんにちは。スタディサプリの小中新規開発チームで Web エンジニアをしている @YutaUra で...`,
      tags: ["GraphQL"],
      publishedAt: "2024-04-15",
      likeUsers: ["highwide", "indigolain", "山田太郎"],
    },
    2: {
      title: "New Relic で Prisma のパフォーマンスを計測してみた",
      author: "YutaUra",
      body: `つい先日リニューアルされた スタディサプリ 中学講座 の開発チームでインターン生をしている @Yut...`,
      tags: ["Prisma", "Observability"],
      publishedAt: "2022-04-01",
      likeUsers: ["ywada526"],
    },
    3: {
      title: '"Fact based" でありがちな失敗をライトに紹介する',
      author: "ywada526",
      body: `はじめまして、Web Engineer の @ywada526 です。 8月から Quipper で...`,
      tags: ["Engineering"],
      publishedAt: "2018-10-15",
      likeUsers: ["y-kaanai", "indigolain"],
    },
    4: {
      title:
        "Developers Summit 2023 SummerでADRについて発表しました & ベストスピーカー賞を受賞しました🎉",
      author: "highwide",
      body: `こんにちは。スタディサプリでプロダクトプラットフォームの開発を行っている @highwide です。...`,
      tags: ["Engineering", "Event", "ADR"],
      publishedAt: "2023-09-15",
      likeUsers: ["ywada526", "YutaUra"],
    },
    5: {
      title:
        "GraphQL Type Mergingを利用したサブスキーマをまたがった宣言的スキーマ定義",
      author: "highwide",
      body: `こんにちは。スタディサプリのWeb開発をやっている @highwide です。\n\n今日は、スタディサ...`,
      tags: ["GraphQL"],
      publishedAt: "2023-06-05",
      likeUsers: ["ywada526", "y-kaanai", "indigolain", "YutaUra"],
    },
    6: {
      title:
        "〜その意思決定を刻め〜「アーキテクチャ・デシジョン・レコード(ADR)」を利用した設計の記録",
      author: "highwide",
      body: `こんにちは。スタディサプリのWeb開発をやっている@highwideです。\n\n今日は、自分の所属する...`,
      tags: ["Engineering", "ADR"],
      publishedAt: "2021-04-05",
      likeUsers: ["indigolain"],
    },
    7: {
      title:
        "縦書き学習コンテンツを実現する際に利用した縦書き CSS プロパティとその奥深さ",
      author: "indigolain",
      body: `こんにちは。スタディサプリで Web Engineer をしている@indigolainです。最近は...`,
      tags: ["CSS"],
      publishedAt: "2022-04-18",
      likeUsers: ["YutaUra", "y-kaanai"],
    },
    8: {
      title: "GraphQL 特集執筆してみた",
      author: "y-kaanai",
      body: `こんにちは。スタディサプリで Web Engineer をしている@y-kaanaiです。この度、技術評論...`,
      tags: ["GraphQL", "Engineering", "執筆"],
      publishedAt: "2999-04-02",
      likeUsers: ["ywada526", "YutaUra", "indigolain", "highwide"],
    },
  },
  users: {
    YutaUra: {
      name: "YutaUra",
      image: "https://github.com/yutaura.png",
    },
    ywada526: {
      name: "ywada526",
      image: "https://github.com/ywada526.png",
    },
    highwide: {
      name: "highwide",
      image: "https://github.com/highwide.png",
    },
    indigolain: {
      name: "indigolain",
      image: "https://github.com/indigolain.png",
    },
    "y-kaanai": {
      name: "y-kaanai",
      image: "https://github.com/y-kaanai.png",
    },
  },
};

const typeDefs = `#graphql
    type PostTag {
      name: String!
      posts: [Post!]!
      count: Int!
    }

    type Post  {
      id: ID!
      title: String!
      body: String!
      tags: [PostTag!]!
      publishedAt: String!
      ranking: Int!
      author: Author!
      likeUsers: [User!]!
      likeCount: Int!
    }

    interface User {
        name: String!
    }
  
    type Author implements User {
      id: ID!
      name: String!
      image: String!
      posts: [Post!]!
    }

    type Viewer implements User {
        name: String!
    }
  
    type Query {
      post(id: ID!): Post
      author(id: ID!): Author
      posts(tags: [String!]): [Post!]!
      authors: [Author!]!
    }
  
    input CreatePostInput {
      title: String!
      body: String!
      tags: [String!]!
      publishedAt: String!
      author: ID!
    }

    type CreatePostSuccess  {
        post: Post!
    }

    interface Error {
        message: String!
    }
    
    type CreatePostBodyTooLongError implements Error {
        message: String!
    }
    type CreatePostAuthorNotFound implements Error {
        message: String!
    }

    union CreatePostPayload = CreatePostSuccess | CreatePostBodyTooLongError | CreatePostAuthorNotFound
  
    type Mutation {
      createPost(input: CreatePostInput!): CreatePostPayload
      likePost(postId: ID!, userId: ID!): Post
    }
  `;

const resolvers = {
  Query: {
    post: (_, { id }) => {
      if (!db.blogs[id]) return null;
      return { id, ...db.blogs[id] };
    },
    author: (_, { id }) => {
      if (!db.users[id]) return null;
      return { id, ...db.users[id] };
    },
    posts: (_, { tags }) =>
      Object.entries(db.blogs)
        .map(([id, post]) => ({ id, ...post }))
        .filter(
          (post) =>
            typeof tags === "undefined" ||
            tags.some((tag) => post.tags.includes(tag))
        ),
    authors: () =>
      Object.entries(db.users).map(([id, user]) => ({ id, ...user })),
  },
  Post: {
    tags: ({ tags }) => tags.map((name) => ({ name })),
    author: ({ author }) => ({ id: author, ...db.users[author] }),
    ranking: ({ id }) => {
      const ranking =
        Object.entries(db.blogs)
          .sort((a, b) => {
            if (a[1].likeUsers.length != b[1].likeUsers.length)
              return b[1].likeUsers.length - a[1].likeUsers.length;
            return b[1].publishedAt.localeCompare(a[1].publishedAt);
          })
          .findIndex(([postId]) => postId === id) + 1;
      return ranking;
    },
    likeUsers: ({ likeUsers }) =>
      likeUsers.map((id) => {
        if (!db.users[id]) return { __typename: "Viewer", name: id };
        return { __typename: "Author", id, ...db.users[id] };
      }),
    likeCount: ({ likeUsers }) => likeUsers.length,
  },
  PostTag: {
    posts: ({ name }) =>
      Object.entries(db.blogs)
        .filter(([_, post]) => post.tags.includes(name))
        .map(([id, post]) => ({ id, ...post })),
    count: ({ name }) =>
      Object.entries(db.blogs).filter(([_, post]) => post.tags.includes(name))
        .length,
  },
  Author: {
    posts: ({ id }) =>
      Object.entries(db.blogs)
        .filter(([_, post]) => post.author === id)
        .map(([id, post]) => ({ id, ...post })),
  },
  Mutation: {
    createPost: (_, { input }) => {
      if (input.body.length > 60) {
        return {
          message: "Body is too long",
          __typename: "CreatePostBodyTooLongError",
        };
      }
      if (!db.users[input.author]) {
        return {
          message: "Author not found",
          __typename: "CreatePostAuthorNotFound",
        };
      }
      const id = Object.keys(db.blogs).length + 1;
      db.blogs[id] = {
        ...input,
        likeUsers: [],
      };
      console.log(id, db.blogs[id]);
      return { __typename: "CreatePostSuccess", post: { id, ...db.blogs[id] } };
    },
    likePost: (_, args) => {
      db.blogs[args.postId].likeUsers = Array.from(
        new Set([...db.blogs[args.postId].likeUsers, args.userId])
      );
      return { id: args.postId, ...db.blogs[args.postId] };
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
