import React, { Component } from 'react';
import './Game.css';
import Timer from './Timer';

class Game extends Component {
  render() {
    return (
      <div>
        <div className="panel panel-default cronometer center-block">
          <div className="panel-body">
            <Timer/>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
