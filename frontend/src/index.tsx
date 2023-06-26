import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserHistory } from "history";
// import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom'

const history = createBrowserHistory({ window });

const root = ReactDOM.createRoot(document.getElementById('root') as any);

root.render(
  <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </React.StrictMode>
);
