import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';


import Game from './components/game/Game';
import HomePage from './components/home/HomePage';
import './App.css';



class App extends Component {
  render() {
    return (
      <div className="App">
        <main>
          <BrowserRouter>
            <Route path="/" exact component={HomePage} />
          </BrowserRouter>
          <BrowserRouter>
            <Route path="/game" exact component={Game} />
          </BrowserRouter>
        </main>
      </div>
    );
  }
}

export default App;
