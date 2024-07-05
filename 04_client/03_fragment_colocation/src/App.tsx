import { useState } from "react";
import { useQuery } from "urql";
import { Post } from "./Post";
import { NewPostForm } from "./NewPostForm";
import { graphql } from "./gql";

// App.tsx 内でkeyとして使うために、
// `title` をFragmentの外側で取得している。
// ※ 誌面とは異なりますがご容赦いただければと思います。
const PostsQuery = graphql(/* GraphQL */ `
  query posts($tags: [String!]) {
    posts(tags: $tags) {
      title
      ...PostFragment
    }
  }
`);

export const ChoosableTags = [
  "GraphQL",
  "Prisma",
  "Observability",
  "Engineering",
  "Event",
  "ADR",
  "CSS",
  "執筆",
] as const;

function App() {
  const [tags, setTags] = useState(["GraphQL"]);

  const [result] = useQuery({
    query: PostsQuery,
    variables: { tags },
  });

  const { data, fetching, error } = result;

  return (
    <>
      <h1>GraphQL Client Sample</h1>
      <fieldset>
        <legend>Choose Blog tags:</legend>

        {ChoosableTags.map((choosableTag) => (
          <div key={choosableTag}>
            <input
              type="checkbox"
              id={choosableTag}
              name={choosableTag}
              checked={tags.includes(choosableTag)}
              onChange={(e) => {
                e.target.checked
                  ? setTags([...tags, e.target.name])
                  : setTags(tags.filter((t) => t !== e.target.name));
              }}
            />
            <label htmlFor={choosableTag}>{choosableTag}</label>
          </div>
        ))}
      </fieldset>

      {fetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Oh no... {error.message}</p>
      ) : (
        data?.posts.map((post) => <Post key={post.title} postFragment={post} />)
      )}
      <hr />
      <NewPostForm />
    </>
  );
}

export default App;
