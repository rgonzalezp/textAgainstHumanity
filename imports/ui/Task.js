

import React, { Component } from 'react';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import './Task.css';
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

        ) : ''}
        <span className="text">

          <strong>Host:</strong> {this.props.task.username}  || <strong>Game:</strong> {this.props.task.text}  || <strong>Players:</strong> {this.props.task.players?this.props.task.players.filter((pl)=>{pl===this.props.username}):''}

        </span>

      </li>


    );

  }

}

