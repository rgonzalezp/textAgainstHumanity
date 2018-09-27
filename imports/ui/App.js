import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import Task from './Task.js';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Container, Row, Col,Button } from 'reactstrap';
import './App.css';
import GameList from './GameList.js';
// App component - represents the whole app
class App extends Component {

  constructor(props) {

    super(props);

 

    this.state = {

      hideCompleted: false,

    };

  }

  handleSubmit(event) {

    event.preventDefault();

    // Find the text field via the React ref

    const text = ReactDOM.findDOMNode(this.input).value.trim();

    Meteor.call('tasks.insert', text);

    // Clear form

    ReactDOM.findDOMNode(this.input).value = '';

  }

  toggleHideCompleted() {

    this.setState({

      hideCompleted: !this.state.hideCompleted,

    });

  }

  renderGameTooltip() {
    return this.props.currentUser ? <h3>Join your friends!</h3>:<h3>Log in to join the game</h3>;
  }

  renderWelcome(){
    return this.props.currentUser ? <h2>Welcome, {this.props.currentUser.username}</h2>:<h2></h2>;
  }
  renderTasks() {

    let filteredTasks = this.props.tasks;

    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (

        <Task

          key={task._id}

          task={task}

          showPrivateButton={showPrivateButton}

        />

      );

    });

  }

  renderCreateGame(){
    return this.props.currentUser ? <div><Row>
      <label>Create a game:</label>
    </Row>
    <Row>
      <Col xs="10">
        <div className="form-group">
          <input type="text" className="form-control" id="usr"/>
        </div>
      </Col>
      <Col xs="2">
        <Button>Create!</Button>
      </Col>
    </Row></div>:
      <h2>Join us to create your room!</h2>;

  }

 

  render() {

    return (
      <div>
        <Container className="text-center"> 
          <h1>Text against humanity... Yes, exactly that.</h1>
        </Container>
        <Container> 
          <Row>
            <Col xs="6">
              <Container className="list-group list-group-flush">
                <Container className="text-center"> 
                  {this.renderGameTooltip()}
                </Container>
                <li id="gamelist-tit"className="list-group-item">
                CURRENT GAMES:
                </li>
                {this.renderTasks()}
              </Container>
            </Col>
            <Col xs="6">
              <Container className="text-center"> 
                {this.renderWelcome()}
                {this.renderCreateGame()}
              </Container>
            </Col>
          </Row>
          <AccountsUIWrapper/>
        </Container>
      </div>
      
    );

  }
  

}
export default withTracker(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);

