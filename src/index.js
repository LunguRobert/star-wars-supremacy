import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    BrowserRouter as Router,
  } from "react-router-dom";
import { w3cwebsocket } from 'websocket';

const client = new w3cwebsocket('ws://star-wars-supremacy-server.onrender.com:3001')

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
        <App client={client}/>
    </Router>
);
