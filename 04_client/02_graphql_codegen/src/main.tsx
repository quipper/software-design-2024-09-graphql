import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";

const client = new Client({
  // url: "YOUR_SERVER_URL",
  url: "http://localhost:4000",
  exchanges: [cacheExchange, fetchExchange],
});

const root = document.getElementById("root");

if (root === null) {
  throw new Error("Root element not found");
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
);
