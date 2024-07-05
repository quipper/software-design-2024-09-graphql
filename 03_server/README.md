## 03_server に置かれたコードについて

Software Design 2024年9月号 GraphQL特集における「第3章 サーバサイドの実装」のためのサンプルコードです。

このディレクトリには次のサンプルコードが含まれています。

- `schema.graphql`: 第2章で紹介されたスキーマの簡略版
- `src/index.ts`: Apollo Server を使ったシンプルなサーバーの実装
- `src/database.ts`: `index.ts` で用いるデータソースをハードコードしたもの
- `src/dataloader.ts`: DataLoader を組み込んだサーバーの実装

なお、ここでは第3章で誌面に掲載したスキーマを用いて実装しています。

そのため、第2章で紹介したスキーマを簡略化しており Mutation の実装なども省いています。興味のある方は 02_graphiql/src/schema.ts をご参照ください。

GraphQL サーバーは次のように起動できます。

```
$ npm install && npm start

(..省略..)

💻 Apollo Server started: http://localhost:4000/
```

本サンプルコードが GraphQL サーバーの実装に役立てば幸いです。
