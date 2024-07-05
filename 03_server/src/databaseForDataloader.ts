export const authors = [
  { id: 1, name: "YutaUra" },
  { id: 2, name: "ywada526" },
  { id: 3, name: "highwide" },
];

export const posts = [
  { id: 1, author_id: 1, title: "hoge", body: "hogehoge" },
  { id: 2, author_id: 1, title: "fuga", body: "fugafuga" },
  { id: 3, author_id: 2, title: "piyo", body: "piyopiyo" },
  { id: 4, author_id: 3, title: "uhyo", body: "uhyouhyo" },
];

export const tags = [
  { post_id: 1, name: "GraphQL" },
  { post_id: 1, name: "Ruby" },
  { post_id: 2, name: "Prisma" },
  { post_id: 2, name: "Observability" },
];
