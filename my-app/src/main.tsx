import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/* 
Finds the root div and draws app inside it 
Allows for switching between HTML pages 

(! = I promise this element exists)
StrictMode = development helper, warns about common mistakes
BrowserRouter = watches the browsers address bar and shares current URL with anything inside it
<App /> sits inside everything and therefore every component in app
  can use the routing features 
*/
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </React.StrictMode>
);