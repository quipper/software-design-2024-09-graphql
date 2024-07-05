import { useState } from "react";
import { gql, useQuery } from "urql";
import { Post, type PostProps } from "./Post";
import { NewPostForm } from "./NewPostForm";

const PostsQuery = gql`
  query posts($tags: [String!]) {
    posts(tags: $tags) {
      title
      body
      author {
        name
      }
    }
  }
`;

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
        data?.posts.map((post: PostProps) => (
          <Post key={post.title} {...post} />
        ))
      )}
      <hr />
      <NewPostForm />
    </>
  );
}

export default App;
