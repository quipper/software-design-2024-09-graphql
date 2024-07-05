import type { FC } from "react";
import { type FragmentType, graphql, useFragment } from "./gql";

const AuthorFragment = graphql(/* GraphQL */ `
  fragment AuthorFragment on Author {
    name
  }
`);

export const Author: FC<{
  authorFragment: FragmentType<typeof AuthorFragment>;
}> = ({ authorFragment }) => {
  const author = useFragment(AuthorFragment, authorFragment);

  return <p>Author: {author.name}</p>;
};
