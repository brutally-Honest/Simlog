import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { configureStore } from "./store/configureStore";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const store = configureStore();
store.subscribe(() => {
  console.log("store updated", store.getState());
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
