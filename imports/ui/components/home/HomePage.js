import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../../../api/tasks.js';
import Task from '../../Task.js';
import {Cards} from '../../../api/cards.js';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from '../../AccountsUIWrapper.js';
import {  Container, Row, Col,Button, Label, Input } from 'reactstrap';
import '../../App.css';
import { Route, Redirect , browserHistory} from 'react-router-dom';
// App component - represents the whole app
class HomePage extends Component {

  constructor(props) {

    super(props);



    this.state = {
      baseCards: false,
      expansion1: false,
      expansion2: false,
      expansion3: false,
      hideCompleted: false,
      name_room:'',
      cartas:[],
      game_ready: false

    };
 
    this.handleChangeBase = this.handleChangeBase.bind(this);
    this.handleChangeExpansion1 = this.handleChangeExpansion1.bind(this);
    this.handleChangeExpansion2 = this.handleChangeExpansion2.bind(this);
    this.handleChangeExpansion3 = this.handleChangeExpansion3.bind(this);
    this.handleNameRoomChange   = this.handleNameRoomChange.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.getCartas = this.getCartas.bind(this);
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
  handleChangeBase () {
    this.setState({baseCards: !this.state.baseCards});
    console.log('CHANGE Base Cards!');
  }
  handleChangeExpansion1 () {
    this.setState({expansion1: !this.state.expansion1});
    console.log('CHANGE Expansion 1 !');
  }
  handleChangeExpansion2 () {
    this.setState({expansion2: !this.state.expansion2});
    console.log('CHANGE Expansion 2!');
  }
  handleChangeExpansion3 () {
    this.setState({expansion3: !this.state.expansion3});
    console.log('CHANGE Expansion 3!');
  }


  getCartas(lista){
    const aqui = this
    return new Promise(function(resolve,reject){
      const playCards = Cards.find({'version':{$in:lista.filter(chk=> chk!==false)}}).fetch();
      aqui.setState({cartas:playCards});
      resolve(true);
    });
  }

  handleNameRoomChange(e){
    this.setState({name_room:e.target.value});
  }
  addRoom(){
    //This is so nested functions can get this
    const aqui = this;
    const {history} =this.props;
    //Base deck
    const base   = this.state.baseCards? 'Base': false;
    //Expansion deck 1 
    const expan1 = this.state.expansion1? 'CAHe1':false;
    const expan2 = this.state.expansion2? 'CAHe2':false;
    const expan3 = this.state.expansion3? 'CAHe3':false;
    const lista = [base,expan1,expan2,expan3];
    let id_game ;
    //Checks that there is minimum one option selected
    if ((base ===false) && (expan1===false) &&(expan2===false)&& (expan3===false)){
      alert('Please choose one deck!');
    }
    else{
      const nombre = this.state.name_room
      if(nombre==='')
      {
        alert('Please give your room a name!')
      }
      else{
        
        console.log('lista: ',lista.filter(chk=> chk!==false));
        // Queria asi  Meteor.call('Cards.get', lista.filter(chk=> chk!==false) 
        const promise = this.getCartas(lista);
        const current_user = this.props.currentUser
        console.log('Current user const: ', current_user)
        promise.then(function(ret){
          console.log('Current user const1: ', current_user)
          aqui.setState({game_ready:true});
        Meteor.call('tasks.insert',nombre, [current_user.username],aqui.state.cartas);
        return true;
        }).then(function(ret){
          console.log('Current user const2: ', current_user)
        const current_juego = Tasks.find({'owner':current_user._id}).fetch();
        return current_juego;
        }).then(function(game){
          console.log('Cartas  : ', aqui.state.cartas)
          console.log('JUgador: ',current_user.username  )
          console.log('Juegos: ', game)
        history.push({
          pathname: '/game',
          state: { cartas_game: aqui.state.cartas, nombre:'test', current_game:game, jugador:current_user }
        });
        
        }).catch(function(error){
          console.log('What is the error: ', error)

        });
      }

    }

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
    console.log('fefe')
    console.log(filteredTasks)
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (

        <Task

          key={task._id}

          task={task}
          historia={this.props.history}
          current_userr={this.props.currentUser}
          showPrivateButton={showPrivateButton}

        />

      );

    });

  }
  renderCheckBoxes(){
    return( <Row>
      <Col xs='3'>
        <Row>
          <Col xs='4'><Label for="checkbox1">Base Cards</Label> </Col>
          <Col xs='8'><Input type="checkbox" id="checkbox1" onChange={this.handleChangeBase}/></Col>
        </Row>
      </Col>
      <Col xs="3">
        <Row>
          <Col xs='4'><Label for="checkbox2">Expan 1</Label> </Col>
          <Col xs='8'><Input type="checkbox" id="checkbox2" onChange={this.handleChangeExpansion1}/></Col>
        </Row>
      </Col>
      <Col xs="3">
        <Row>
          <Col xs='4'><Label for="checkbox3">Expan 2</Label> </Col>
          <Col xs='8'><Input type="checkbox" id="checkbox3" onChange={this.handleChangeExpansion2}/></Col>
        </Row>
      </Col>
      <Col xs="3">
        <Row>
          <Col xs='4'><Label for="checkbox4">Expan 3</Label> </Col>
          <Col xs='8'><Input type="checkbox" id="checkbox4" onChange={this.handleChangeExpansion3}/></Col>
        </Row>
      </Col>
    </Row>
    );
  }

  renderCreateGame(){
    return this.props.currentUser ? 
    
      <Container className='border'>

        
        <Row className='border'>
          <Label className="">Create a game:</Label>
        </Row>
        <Row className='border'>
          <Col md="12">
            <Row>
              <Label className="labelDeck">Select your playing decks</Label>
            </Row>
          </Col>
        </Row>
        {this.renderCheckBoxes()}
        <Row className='border'>
          <Col xs="10">
            <div className="form-group">
              <Input type="text" className="form-control" id="usr" onChange={this.handleNameRoomChange}/>

            </div>
          </Col>
          <Col xs="2">
            <Button id="usrBtn" onClick={this.addRoom.bind(this)}>Create!</Button>
          </Col>
        </Row>
      </Container>:
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
              <Container className="list-group">
                <Container className="text-center"> 
                  {this.renderGameTooltip()}
                </Container>
                <ul className="list-group">
                  <li id="gamelist-tit"className="list-group-item">
                  CURRENT GAMES:
                  </li>
                  {this.renderTasks()}
                </ul>
              </Container>
            </Col>
            <Col xs="6">
              <Container className="text-center"> 
                {this.renderWelcome()}
                {this.renderCreateGame()}
                <AccountsUIWrapper/>
              </Container>
            </Col>
          </Row>
        </Container>
      
      </div>
      
    );

  }
  

}
export default withTracker(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('Cards');
  console.log('Cabezera de todos: ')
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
    cards: Cards.find({}, { sort: { createdAt: -1 } }).fetch()
  };
})(HomePage);

