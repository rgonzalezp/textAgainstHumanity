import React, { Component } from 'react';
import './GameList.css';

export default class GameList extends Component {
  constructor(props) {

    super(props);

  }

  renderGameList() {
    if(this.props.tasks instanceof Array)
    {
      return this.props.tasks.map((game) =>  <li className="list-group-item" key ={game._id}>{game.name}</li>);
    } else {
      return '';
    }
  }
  render() {
    return (
      <div>
        {this.renderGameList}
      </div>
    );
  }
}
