import './App.css';
import React , { useState, useEffect, useRef } from 'react';
import Loading from './components/Loading/Loading';
import Game from './components/Game/Game';
import Room from './components/Room/Room'
import {
  Routes,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import { neonCursor } from 'https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js'

function App({client}) {

  useEffect(()=>{
    
    neonCursor({
      el: document.getElementById('app'),
      shaderPoints: 16,
      curvePoints: 25,
      curveLerp: 0.5,
      radius1: 3,
      radius2: 1,
      velocityTreshold: 10,
      sleepRadiusX: 1000,
      sleepRadiusY: 1000,
      sleepTimeCoefX: 0.0025,
      sleepTimeCoefY: 0.0025
    })
  },[])

  return (
    <div id='app' className="App">
        <Routes>
          <Route path='/' element={<Room client={client}/>}/>
          <Route path='/loading/:roomNumber/:uniqueId/' element={<Loading client={client}/>}/>
          <Route path='/game/:roomNumber/:uniqueId/:gameMode' element={<Game client={client}/>}/>

        </Routes>
    </div>
  );
}

export default App;
