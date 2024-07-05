import { type FC, useState } from "react";
import { gql, useMutation } from "urql";
import { ChoosableTags } from "./App";

const CreatePostMutation = gql`
  mutation createPost($input: CreatePostInput!) {
    createPost(input: $input) {
      __typename
      ... on CreatePostSuccess {
        post {
          id
          __typename
          title
          body
          author {
            id
            name
          }
        }
      }
      ... on Error {
        message
      }
    }
  }
`;

// GraphQLサーバーにauthors Queryを投げると取得できるが
// 誌面をシンプルにするために定数で定義している
const ChoosableAuthors = [
  "YutaUra",
  "ywada526",
  "highwide",
  "indigolain",
  "y-kaanai",
] as const;

type Input = {
  title: string;
  body: string;
  tags: string[];
  publishedAt: string;
  author: string;
};

export const NewPostForm: FC = () => {
  const [input, setInput] = useState<Input>({
    title: "",
    body: "",
    tags: [],
    publishedAt: "",
    author: "",
  });

  const [createPostResult, createPost] = useMutation(CreatePostMutation);

  return (
    <>
      <h2>New Post</h2>

      <div>
        <label>title</label>
      </div>
      <input onChange={(e) => setInput({ ...input, title: e.target.value })} />

      <div>
        <label>body</label>
      </div>
      <textarea
        onChange={(e) => setInput({ ...input, body: e.target.value })}
      />
      <div>
        <label>tags</label>
      </div>
      {ChoosableTags.map((choosableTag) => (
        <div key={choosableTag}>
          <input
            type="checkbox"
            id={`new-post-${choosableTag}`}
            name={choosableTag}
            checked={input.tags.includes(choosableTag)}
            onChange={(e) => {
              e.target.checked
                ? setInput({
                    ...input,
                    tags: [...input.tags, e.target.name],
                  })
                : setInput({
                    ...input,
                    tags: input.tags.filter((t) => t !== e.target.name),
                  });
            }}
          />
          <label htmlFor={`new-post-${choosableTag}`}>{choosableTag}</label>
        </div>
      ))}
      <div>
        <label>author</label>
      </div>
      <select onChange={(e) => setInput({ ...input, author: e.target.value })}>
        {ChoosableAuthors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>
      <div>
        <button
          type="button"
          onClick={() => {
            createPost({
              input: { ...input, publishedAt: new Date().toISOString() },
            });
          }}
        >
          Create
        </button>
      </div>
      {createPostResult.fetching ? (
        <p>Creating...</p>
      ) : createPostResult.error ? (
        <p>Oh no... {createPostResult.error.message}</p>
      ) : createPostResult?.data?.createPost?.__typename !==
        "CreatePostSuccess" ? (
        <p>Oh no... {createPostResult?.data?.createPost?.message}</p>
      ) : (
        <p>Created!</p>
      )}
    </>
  );
};
