import React from "react";
import ReactDOM from "react-dom/client";
import { Fetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import "graphiql/graphiql.css";
import "./index.css";
import { schema } from "./schema";
import { execute, parse } from "graphql";
import { validate } from "graphql/validation";

const fetcher: Fetcher = (params, _) => {
  const document = parse(params.query);
  const errors = validate(schema, document);
  if (errors.length > 0) {
    return Promise.resolve({ errors });
  }
  return execute({
    schema,
    document,
    operationName: params.operationName,
    variableValues: params.variables,
  });
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div id="app">
      <GraphiQL fetcher={fetcher} />
    </div>
  </React.StrictMode>
);
