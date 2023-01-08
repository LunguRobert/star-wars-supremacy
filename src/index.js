import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    BrowserRouter as Router,
  } from "react-router-dom";
import { w3cwebsocket } from 'websocket';

const client = new w3cwebsocket('wss://star-wars-supremacy-server.onrender.com')

client.onopen = () => {
    setInterval(stayAwake, 20000);
    stayAwake();
};

function stayAwake(){
    console.log(client.readyState);
    client.send(JSON.stringify({type: 'stay_awake'}));
    console.log('stay awake')
}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
        <App client={client}/>
    </Router>
);
