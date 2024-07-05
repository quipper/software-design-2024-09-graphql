import type { FC } from "react";
import { Author } from "./Author";
import { type FragmentType, graphql, useFragment } from "./gql";

const PostFragment = graphql(/* GraphQL */ `
  fragment PostFragment on Post {
    title
    body
    author {
      ...AuthorFragment
    }
  }
`);

export const Post: FC<{ postFragment: FragmentType<typeof PostFragment> }> = ({
  postFragment,
}) => {
  const post = useFragment(PostFragment, postFragment);

  return (
    <>
      <h2>{post.title}</h2>
      <div>{post.body}</div>
      <Author authorFragment={post.author} />
    </>
  );
};
