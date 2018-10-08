

import React, { Component } from 'react';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import './Task.css';
import { Button } from 'reactstrap';

// Task component - represents a single todo item

export default class Task extends Component {

  toggleChecked() {

    // Set the checked property to the opposite of its current value

    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);

  }

 

  deleteThisTask() {

    Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate() {

    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);

  }

  redirect() {
    this.props.history.push('/game');
  }

  joinGameRoom(){
    console.log('entra a game room')
    console.log(this.props.task)
      const history = this.props.historia
      const user_   = this.props.current_userr
      console.log(user_!==null)
      //did this twice: One here and another in tasks.addPlayer
      // dont want to break stuff so wont change it for now because of time
      if(user_!==null)
      {
        Meteor.call('tasks.addPlayer',this.props.task._id )
        history.push({
          pathname: '/game',
          state: { current_game:Tasks.find({_id:this.props.task._id}).fetch() }
        });
      }
      else{
        alert('Please login or create an account first!')
      }
  }

  renderButtonJoin(){
    return (<Button onClick={this.joinGameRoom.bind(this)}>Join</Button>)
  }

  render() {

    // Give tasks a different className when they are checked off,

    // so that we can style them nicely in CSS

    const taskClassName = classnames({

      checked: this.props.task.checked,

      private: this.props.task.private,

    });
 

    return (
      <li className="list-group-item">
        { this.props.showPrivateButton ? (

          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>

            { this.props.task.private ? 'Private' : 'Public' }

          </button>

        ) : this.renderButtonJoin()  }
        <span className="text">
          <strong>Host:</strong> {this.props.task.username}  || <strong>Game:</strong> {this.props.task.text}  || <strong>Players:</strong> {this.props.task.players.filter(ply=>ply!==this.props.task.username)}

        </span>

      </li>


    );

  }

}

