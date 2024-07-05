import type { FC } from "react";
import { Author, type AuthorProps } from "./Author";

type PostProps = {
  title: string;
  body: string;
  author: AuthorProps;
};

export const Post: FC<PostProps> = ({ title, body, author }) => {
  return (
    <>
      <h2>{title}</h2>
      <div>{body}</div>
      <Author {...author} />
    </>
  );
};
