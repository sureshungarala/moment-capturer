import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Upload from './components/Upload';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="MC-App">
        <Header />
        <div className="mcBody">
          <Switch>
            <Route path="/" component={Upload} exact></Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
