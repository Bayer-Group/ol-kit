import React from "react";
import TopNav from './TopNav'
import MapView from './MapView'
import LocationForm from './LocationForm'
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";

const App = () => {
    console.log('rendering')
  return ( <MapView />
    // <Router>
    //     <TopNav/>
    //     <Switch>
    //       <Route exact path="/" ><MapView /></Route>
    //       <Route path="/add"><LocationForm /></Route>
    //     </Switch>
    // </Router>
  );
}

export default App;
