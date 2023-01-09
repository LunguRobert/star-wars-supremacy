import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    BrowserRouter as Router,
  } from "react-router-dom";
import { w3cwebsocket } from 'websocket';

const client = new w3cwebsocket('wss://whimsical-kitten-e5dca1.netlify.app')

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
        <App client={client}/>
    </Router>
);
