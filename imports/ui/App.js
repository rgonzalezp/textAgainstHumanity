import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter , Switch} from 'react-router-dom';
global.jQuery = require('jquery');
// Esta parte de bootsrap queda mejor en el HTML
require('bootstrap');
import 'bootstrap/dist/css/bootstrap.css';


import Game from './components/game/Game';
import HomePage from './components/home/HomePage';
import './App.css';



class App extends Component {
  render() {
    return (
      <div className="App">
        <main>
          <BrowserRouter>
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/game" exact component={Game} />
            </Switch>
          </BrowserRouter>
        </main>
      </div>
    );
  }
}

export default App;
