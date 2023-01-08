import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    BrowserRouter as Router,
  } from "react-router-dom";
import { w3cwebsocket } from 'websocket';

const client = new w3cwebsocket('wss://star-wars-supremacy-server.onrender.com')
console.log(client.readyState);
function stayAwake(){
    if (client.readyState === 1) {
        client.send(JSON.stringify({type: 'stay_awake'}));
    }
}

setTimeout(stayAwake,20000);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
        <App client={client}/>
    </Router>
);
