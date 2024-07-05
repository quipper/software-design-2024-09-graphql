// このコードはGraphiQLで直接実行することはできません。
const id = "1";
const query = `\
query WorstQuery {
  post(id: "${id}") {
    title
  }
}`;
