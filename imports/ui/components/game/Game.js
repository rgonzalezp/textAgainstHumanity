import React, { Component } from 'react';
import './Game.css';
import Timer from './Timer';
import {  Container, Row, Col,Button, Label, Input, ListGroup, ListGroupItem, Alert } from 'reactstrap';
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
      black_card:'',
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
    this.updateCurrentPlayer = this.updateCurrentPlayer.bind(this)
    this.updateBlackCard  = this.updateBlackCard.bind(this)
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
     console.log('currentGame: ',this.props )
      this.setState({task:this.props.task[0]})
     }

     renderAnswerBlocks(card_sub){
      console.log(card_sub)
      try{
      if(card_sub.split('_').length<=2){
        return (    <Container>
          <Label className="exampleBlackCard">{card_sub}</Label>
          <Input type="textarea" name="inp1" id="input_1" placeholder="Add your answer!" onChange={this.handleChangeInput1} />
          <Button outline color="secondary">Submit your game!</Button></Container>)
      }
      else{
        return (    <Container>
          <Label className="exampleBlackCard">{card_sub} </Label>
          <Input type="textarea" name="inp1" id="input_1" placeholder="Add your answer for 1st blank!" onChange={this.handleChangeInput1} />
          <Input type="textarea" name="inp2" id="input_2" placeholder="Add your answer for 2nd blank!" onChange={this.handleChangeInput2}/>
          <Button outline color="secondary">Submit your game!</Button> </Container>)
      }
    }
    catch(error){
        console.log('Trying to split when there is nothing to split')
    }
     }

     updateBlackCard(task_id, carta){

      //this.setState({black_card})
      Meteor.call('tasks.updateTaskBlack',task_id,carta)
     }
     getBlackCardGame(){
      if(this.state.cards.length!==0)
      {   
        console.log('Entra a black')
        console.log('Task?: ', this.state.task)
        console.log('Player: ',this.state.player)
        //Aunque esto tiene que ser global de la bd
        const state_card = this.state.task.carta;
        console.log('What is the state of de card: ', state_card)
        if (typeof(state_card)==='undefined'){
        let card =  this.state.cards[Math.floor(Math.random()*this.state.cards.length)];
        
        console.log('before updateCard: ', card.text)
        
        this.updateBlackCard(this.state.task._id,card.text)
        let card_sub = card.text.split("_");
        //this.renderAnswerBlocks(card_sub);

        }
        else{
          console.log('hay black card y eso: ', state_card)
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

      updatePlayer = () =>{
        console.log('Update Player in game:');
        console.log(this.props)
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

    try{
      if(this.state.task.players.length!==this.props.task[0].players.length)
      {
        this.setState({task:this.props.task[0]})
      }
    }
    catch(error){
      console.log('Error  task: ',this.state.task)
      console.log('Error  task[0]: ',this.props.task[0])
    }
  }

  definePlayers(){
    let obj_array =[]
    this.props.task[0].players.map((play,index)=>{
      let obj_temp = {}
      console.log('index: ',index)
      console.log('player: ', play)
       obj_temp = {'ready':false, 'player':play}
     obj_array.push(obj_temp)
    })
    Meteor.call('tasks.definePlayer',this.props.task[0]._id,obj_array)

//console.log('obje array: ', obj_array)

     
  }
  gameBegin(task_id){
    {this.getBlackCardGame()}
    {this.definePlayers()}
      Meteor.call('tasks.activateGame',task_id)
  }

  renderGameBoard(){
    if(this.props.task[0].game_on){
      console.log('sso renderBlock?Much')
      return this.renderAnswerBlocks(this.props.task[0].blackcard)
    }
  }
  renderMasterBoard(){
    console.log('Rendermasterboard')
    console.log(this.props.master)
    console.log('Task diff')
    console.log(this.state.task)
    console.log(this.props.task[0])
    return (<Container>
      {this.changeTask()}
      {this.renderPlayers()}
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

  renderPlayerState(indx){
    console.log('RenderPLayerState whata up: ', indx)
    if(indx===0){
      if (this.props.task[0].player_1.ready){
        return      ( <Button color="success">
        Ready!!
      </Button>)
      }
      else{
        return      ( <Button color="danger">
        Not Ready :(
      </Button>)
      }
    }
    else if(indx===1){
      if (this.props.task[0].player_2.ready){
        return      ( <Button color="success">
        Ready!!
      </Button>)
      }
      else{
        return      ( <Button color="danger">
        Not Ready :(
      </Button>)
      }
    }
    else if (indx===2){
      if (this.props.task[0].player_3.ready){
        return      ( <Button color="success">
        Ready!!
      </Button>)
      }
      else{
        return      ( <Button color="danger">
        Not Ready :(
      </Button>)
      }
    }
    else if (indx===3){
      if (this.props.task[0].player_4.ready){
        return      ( <Button color="success">
        Ready!!
      </Button>)
      }
      else{
        return      ( <Button color="danger">
        Not Ready :(
      </Button>)
      }
    }
  }
  renderJugador(jugadores) {
    console.log('render Jugador :',jugadores)
     return  jugadores.map((jug,ind) => {
       if(this.props.task[0].game_on)
       {
       return (<Row><Col sm='12'><ListGroupItem key={ind}>{jug} </ListGroupItem></Col><Col sm='12' key={ind}>{this.renderPlayerState(ind)}</Col></Row>)
       }
       else{
        return <ListGroupItem key={ind}>{ jug}</ListGroupItem>
       }
     }
      );
  }

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



static getDerivedStateFromProps(props, state){
  console.log('Really get Derived: ',props)
  console.log('more really: ', state)
}


renderWelcome(){
  const playerName = this.props.player
  return <Container><Row><h2>Hello!!! {playerName}</h2></Row>
  <Row> 
  {this.props.task[0].game_on?<h2>Be a prick!!</h2>:this.props.master?
  <Button className='startbtn'onClick = {()=> this.gameBegin(this.props.task[0]._id)} outline color="success"  block>
  Start game!
  </Button>:<h3>Please wait until game begins</h3>}</Row> </Container>
}
  render() {
    console.log('Master of puppets render(): ', this.props.master)
    return (
      <div>
       <Container>
        <Row>
        <Col sm = '4' >
        <div className="panel panel-default sidebar center-block">
        <div className="panel-body">
     {  this.renderWelcome() /*    <Timer
            task = {this.props.task} 
            master = {this.state.master}
            owner = {this.props.owner}
            ref={(timer) => {this.timer = timer}}
            checkGameState= {this.checkGameState}
            />
     */ }
          </div>
        </div>
        <div className="panel panel-default sidebar center-block">
          <div className="panel-body">
          {this.props.master?this.renderMasterBoard():this.renderSlaveBoard()}
          </div>  
        </div>
        </Col>
        <Col sm = '8' >
        <div className="panel panel-default cronometer center-block">
          <div className="panel-body">
          {console.log('This props game_on: ', this.props.task[0].game_on)}
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA FIGHT
            {this.props.task[0].game_on?this.renderGameBoard():''}
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
  const player = props.location.state.jugador
  const master_puppets = props.location.state.current_game[0].owner===player._id?true:false
  console.log('Master of puppets: ', master_puppets)
  Meteor.subscribe('task',props.location.state.current_game[0].owner)

  return {
    task: Tasks.find({owner:dueno}).fetch(),
    owner: dueno,
    master: master_puppets,
    player: player.username
  };
})(Game);
