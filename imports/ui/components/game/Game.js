import React, { Component } from 'react';
import './Game.css';
import Timer from './Timer';
import {  Container, Row, Col,Button, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';
import { Tasks } from '../../../api/tasks.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class Game extends Component {
  constructor(props) {

    super(props);



    this.state = {
      player:'',
      task:{},
      cards:[],
      master:false,
      turn:0
    };
    this.handleChangeInput1 = this.handleChangeInput1.bind(this);
    this.handleChangeInput2 = this.handleChangeInput1.bind(this);
    this.checkGameState = this.checkGameState.bind(this);
    this.updateCardState = this.updateCardState.bind(this)
    this.updateTaskState = this.updateTaskState.bind(this);
    this.updateCurrentPlayer =this.updateCurrentPlayer.bind(this)
    this.updateMaster   = this.updateMaster.bind(this)
  }


  handleChangeInput1(evt){
    console.log(`Input 1: ${evt.target.value}`);
  }

  handleChangeInput2(evt){
    console.log(`Input 2: ${evt.target.value}`);
  }
  


  updateCardState = () => {
    this.setState({cards:this.props.location.state.cartas_game})
  }
  updateTaskState = ()=>{
    //  console.log('updatetask: ',this.props.location.state.current_game)
      const   current_juego = this.props.location.state.current_game //Tasks.find({'owner':this.props.location.state.current_game[0]}).fetch();
    //  console.log('currentGame: ',current_juego)
      this.setState({task:current_juego[0]})
     }
     getBlackCardGame(){
      if(this.state.cards.length!==0)
      {
        console.log('Entra a black')
        console.log('Task?: ', this.state.task)
        console.log('Player: ',this.state.player)
        //Aunque esto tiene que ser global de la bd
        let card =  this.state.cards[Math.floor(Math.random()*this.state.cards.length)];
      
        let card_sub = card.text.split("_");
        console.log(card_sub)
        if(card_sub.length<=2){
          return (    <Container>
            <Label className="exampleBlackCard">{card.text}</Label>
            <Input type="textarea" name="inp1" id="input_1" placeholder="Add your answer!" onChange={this.handleChangeInput1} />
            </Container>)
        }
        else{
          return (    <Container>
            <Label className="exampleBlackCard">{card.text} </Label>
            <Input type="textarea" name="inp1" id="input_1" placeholder="Add your answer for 1st blank!" onChange={this.handleChangeInput1} />
            <Input type="textarea" name="inp2" id="input_2" placeholder="Add your answer for 2nd blank!" onChange={this.handleChangeInput2}/>
            </Container>)
        }
      }
  
    }
    updateMaster = () => {

      console.log('UPDATEMASTER: ', this.state.player)
          this.setState({master: !this.state.master})
      }

      updateCurrentPlayer = (nam)=>{
        this.setState({player:nam})
      }

  submitCurrentGame() { 

  }

  checkGameState( gamePhase , gameState) {
    //this method needs to change state in game component to re-render different componetns
    console.log("currentRound", gamePhase);
    console.log("currentGameState",gameState);
  }

  
  componentDidMount(){
   // console.log('didMount: ',this.props.task)
    if(this.state.cards.length===0){
     // console.log('task: ',this.props.location.state.current_game)
      const nPlyr   = this.props.location.state.jugador.username
      //console.log('player: ',this.props.location.state.jugador)
     // console.log('cards: ',this.props.location.state.cartas_game)
     // this.setState({task:this.props.location.state.current_game[0]});
      this.updateTaskState()
      this.updateCurrentPlayer(nPlyr)
      this.updateCardState()
    }
    else{
      console.log('comodidmount else')
        if(this.state.cards.length)
        {

        }
    }
  }
  changeTask(){
    if(this.state.task.players.length!==this.props.task[0].players.length)
    {
      this.setState({task:this.props.task[0]})
    }
  }
  renderMasterBoard(){
    console.log('Rendermasterboard')
    console.log(this.state.master)
    console.log('Task diff')
    console.log(this.state.task)
    console.log(this.props.task[0])
    return (<Container>
      {this.changeTask()}
      {this.renderPlayers()}
      <Row>
        <Col sm='12'>
        </Col>
      </Row>
    </Container>)
  }

  renderSlaveBoard(){
    console.log('comomomun')
    let empty = Object.getOwnPropertyNames(this.state.task).length === 0
    console.log(empty)

      if(typeof(this.state.task)==='undefined'|| empty){
          console.log('task is undefined')
        }
        else{
         console.log(this.state)
          return(this.state.task?this.renderPlayers():'Loading')
        }
  }

  renderJugador(jugadores) {
    console.log('render Jugador :',jugadores)
     return  jugadores.map((jug,ind) => {
    return <ListGroupItem key={ind}>{ jug}</ListGroupItem>
     }
      );
  }

/*
  componentDidUpdate(){
    console.log('begini ')
    //console.log()
    /*
   if(typeof(this.state.player)!=='undefined'&& typeof(this.state.task)!=='undefined')
   {
     //console.log(this.state.player)
     console.log('haaa')
     //console.log(this.state.task)
      if(this.state.player===this.state.task.username){
       // console.log('iii')
        if(this.state.master===false){
         // console.log('eee')
          this.updateMaster()
        }
        else{
         // console.log('ur are masters')
         // console.log(this.state.master)  
          //console.log(this.state.task.players)
          //console.log(this.props)

          if(typeof(this.props.task[0])!=='undefined')
          {
            console.log('whyyes')
            console.log(this.props.task[0].players)
            console.log(this.state.task)
            console.log('why is this like this: ',this.props.task[0].players!==this.state.task.players)
            console.log(this.state.task.players)
            if(this.props.task[0].players.length!==this.state.task.players.length)
            {
              console.log('did enter to change?:')
              this.setState({task:this.props.task[0]})
            }
          }
        }
      }
   }
   else{
     console.log('heeee')
     console.log(this.state.task)
   }
   
  }
*/
  renderMasterTimer() {

  }

  renderSlaveTimer() {

  }

  renderPlayers() {
    console.log('RenderPlayers: ', this.state.task)
    const {players} = this.state.task

    if(typeof(players)==='undefined')
    { 
      return (<h2>Loading</h2>)
    }
    else{
    return(    
      <Container>
     <Row>
      <Col sm='12'>
      <h1>Currently there are: {players.length}  players </h1>
      </Col>
    </Row>
      <ListGroup>
      {this.renderJugador(players)}
      </ListGroup>
      </Container>  

    )
  }
}
  render() {
    const player = this.props.location.state.jugador
    const master_puppets = this.props.location.state.current_game[0].owner===player._id?true:false
    if(master_puppets && this.state.master===false)
    {
      this.updateMaster();
    }
    return (
      <div>
       <Container>
        <Row>
        <Col sm = '4' >
        <div className="panel panel-default sidebar center-block">
        <div className="panel-body">
     {       <Timer
            task = {this.props.task} 
            master = {this.state.master}
            owner = {this.props.owner}
            ref={(timer) => {this.timer = timer}}
            checkGameState= {this.checkGameState}
            />
    }
          </div>
        </div>
        <div className="panel panel-default sidebar center-block">
          <div className="panel-body">
          {this.state.master?this.renderMasterBoard():this.renderSlaveBoard()}
          </div>
        </div>
        </Col>
        <Col sm = '8' >
        <div className="panel panel-default cronometer center-block">
          <div className="panel-body">
            
          </div>
        </div>
        </Col>
      
      </Row>
    </Container>
      </div>
    );  
  }
}

export default withTracker((props) => {
  console.log('Wahtadapmotherfucker')

  let dueno
  //Estos ifs son para verificar formato nada mas de como entra el
  //game (task)
  //console.log((props))
  if(typeof(props.location.state.current_game)==='object')
  {
    console.log('entro a primer if')
    if(typeof(props.location.state.current_game.owner)==='undefined')
    {
      dueno =  props.location.state.current_game[0].owner
    }
    else{
      console.log(props.location.state.current_game)

      dueno = props.location.state.current_game.owner
    }
  }
  else{
    //console.log('entro a segundo if')
    //console.log(props.location.state.current_game[0].owner)
  }
  console.log(dueno)
  Meteor.subscribe('task',props.location.state.current_game[0].owner)

  return {
    task: Tasks.find({owner:dueno}).fetch(),
    owner: dueno,
  };
})(Game);
