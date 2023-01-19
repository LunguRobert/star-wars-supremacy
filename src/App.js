import "./App.css";
import React from "react";
import Loading from "./components/Loading/Loading";
import Game from "./components/Game/Game";
import Room from "./components/Room/Room";
import ResolutionChecker from './components/ResolutionChecker/ResolutionChecker';
import {
  Routes,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

function App({ client }) {
  return (
    <div id="app" className="App">
      <ResolutionChecker/>
      <Routes>
        <Route path="/" element={<Room client={client} />} />
        <Route
          path="/loading/:roomNumber/:uniqueId/"
          element={<Loading client={client} />}
        />
        <Route
          path="/game/:roomNumber/:uniqueId/:gameMode"
          element={<Game client={client} />}
        />
      </Routes>
    </div>
  );
}

export default App;
