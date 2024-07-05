// このコードはGraphiQLで直接実行することはできません。
const id = '1") { title: body } _: post(id: "1';

// このidが使われた場合に作られるGraphQLクエリ
const query = `\
query WorstQuery {
  post(id: "1") {
    title: body
  }
  _: post(id: "1") {
    title
  }
}`;
