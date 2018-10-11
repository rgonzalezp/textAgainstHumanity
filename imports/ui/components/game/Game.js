import React, { Component } from 'react';
import './Game.css';
import Timer from './Timer';
import {  Container, Row, Col,Button, Label, Input, ListGroup, ListGroupItem, Alert} from 'reactstrap';
import { Tasks } from '../../../api/tasks.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Modal from 'react-modal';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Game extends Component {
  constructor(props) {

    super(props);
    this.state = {
      player:'',
      task:{},
      cards:[],
      black_card:'',
      master:false,
      input_text : ['%%'],
      input_text2:['%%'],
      player_pos:-1,
      modalIsOpen: false,
      voted:false,
    };
    this.handleChangeInput1 = this.handleChangeInput1.bind(this);
    this.handleChangeInput2 = this.handleChangeInput2.bind(this);
    this.checkGameState = this.checkGameState.bind(this);
    this.updateCardState = this.updateCardState.bind(this)
    this.updateTaskState = this.updateTaskState.bind(this);
    this.updateCurrentPlayer =this.updateCurrentPlayer.bind(this)
    this.updateMaster   = this.updateMaster.bind(this)
    this.updateCurrentPlayer = this.updateCurrentPlayer.bind(this)
    this.updateBlackCard  = this.updateBlackCard.bind(this)
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }


  handleChangeInput1(evt){
    console.log(evt.target)
    console.log(evt)
    console.log(`Input 1: ${evt.target.value}`);
    const input_text = evt.target.value
    const newArr = this.state.input_text
    console.log(newArr)
    if(newArr.length>=1){
      if(newArr[0]!==input_text){
        newArr[0]=input_text
        console.log('newinput[0]: ', newArr[0])
        this.setState({input_text:newArr})
      }
    }
  }

  handleChangeInput2(evt){
    console.log(evt.target)
    console.log(`Input 2: ${evt.target.value}`);
    const input_text2 = evt.target.value
    const newArr = this.state.input_text2
    if(newArr.length>=1){
      if(newArr[0]!==input_text2){ 
        newArr[0]=input_text2
        console.log('newinput[1]: ', newArr[0])
        this.setState({input_text2:newArr})
      }
    }
  }
  


  updateCardState = () => {
    if(!this.props.task[0].game_on) {
      this.setState({cards:this.props.location.state.cartas_game})
    } else {
      console.log("entro en updateDeck");
      this.setState({cards:this.props.task[0].cards})
    }
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
          <Label className="exampleBlackCard1">{card_sub}</Label>
          <Input type="textarea" name="inp1" id="input_1" placeholder="Write your answer!" onChange={this.handleChangeInput1} />
          <Button outline color="secondary" onClick = {()=> this.submitCurrentGame()}>Submit your answer!</Button></Container>)
      }
      else{
        return (    <Container>
          <Label className="exampleBlackCard2">{card_sub} </Label>
          <Input type="textarea" name="inp1" id="input_1" placeholder="Write your answer for 1st blank!" onChange={this.handleChangeInput1} />
          <Input type="textarea" name="inp2" id="input_2" placeholder="Write your answer for 2nd blank!" onChange={this.handleChangeInput2}/>
          <Button outline color="secondary" onClick = {()=> this.submitCurrentGame()}>Submit your answers!</Button> </Container>)
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

    this.changeVote();

    if(this.state.cards===undefined) {
      this.updateCardState();
    }
     // const player = this.returnPlayer()//this.props.task[0].player;
      let new_obj;
      const aqui = this
      let obj_temp = {}
      if(aqui.props.player===aqui.props.task[0].player_1.player){
         obj_temp=  aqui.props.task[0].player_1
      //  return obj_temp
      }
    
      else if(aqui.props.player===aqui.props.task[0].player_2.player){
         obj_temp = aqui.props.task[0].player_2
        //return obj_temp 
      }
    
      else if(aqui.props.player===aqui.props.task[0].player_3.player){
         obj_temp = aqui.props.task[0].player_3
        //return obj_temp
      }
    
      else if(aqui.props.player===aqui.props.task[0].player_4.player){
         obj_temp = aqui.props.task[0].player_4
       // return obj_temp
      }
      console.log('Submit current game: ',this.state)
      console.log(obj_temp)

      if(this.props.task[0].players.length<4)
      {
        this.openModal();
      }
      Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,obj_temp,this.state.input_text,this.state.input_text2)

      /*
      if (this.props.task[0].player_1.player===player)
      {
        console.log('Submit current game player1: ',this.state.input_text)
         Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,this.props.task[0].player_1,this.state.input_text)
      }
      else if (this.props.task[0].player_2.player===player){
        console.log('Submit current game player2: ',this.state.input_text)
        Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,this.props.task[0].player_2,this.state.input_text)
      }
      else if (this.props.task[0].player_3.player===player){
        console.log('Submit current game player3: ',this.state.input_text)
        Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,this.props.task[0].player_3,this.state.input_text)
      }
      else if (this.props.task[0].player_4.player===player){
        console.log('Submit current game player4: ',this.state.input_text)
        Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,this.props.task[0].player_4,this.state.input_text)
        
      }
      */

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
       obj_temp = {'ready':false, 'player':play,'pos':index+1, 'input_text':['%%']}
     obj_array.push(obj_temp)
    })

    Meteor.call('tasks.definePlayer',this.props.task[0]._id,obj_array)

//console.log('obje array: ', obj_array)

     
  }
  gameBegin(task_id){
    {this.updateCardState()}
    {this.getBlackCardGame()}
    {this.definePlayers()}
      Meteor.call('tasks.activateGame',task_id)
  }

  returnPlayer(){ 
    let aqui = this
        //if duplicates paila
        if(aqui.props.task[0].player===aqui.props.task[0].player_1.player){
          const obj_temp=  aqui.props.task[0].player_1
          return obj_temp
        }
      
        else if(aqui.props.task[0].player===aqui.props.task[0].player_2.player){
          const obj_temp = aqui.props.task[0].player_2
          return obj_temp 
        }
      
        else if(aqui.props.task[0].player===aqui.props.task[0].player_3.player){
          const obj_temp = aqui.props.task[0].player_3
          return obj_temp
        }
      
        else if(aqui.props.task[0].player===aqui.props.task[0].player_4.player){
          const obj_temp = aqui.props.task[0].player_4
          return obj_temp
        }
}

  submitVote(e) { 
     // const player = this.returnPlayer()//this.props.task[0].player;

     this.setState({
      voted:true
     });
     //The id returns the array position of the player... e.g 0 = player 1
     const voteForPlayer = e.currentTarget.id;
      let new_obj;
      const aqui = this
    
      

      Meteor.call('tasks.voteForPlayer',this.props.task[0]._id,voteForPlayer);
      console.log('Submit current game: ',this.state)

      this.checkForWinner();

      

      /*
      if (this.props.task[0].player_1.player===player)
      {
        console.log('Submit current game player1: ',this.state.input_text)
         Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,this.props.task[0].player_1,this.state.input_text)
      }
      else if (this.props.task[0].player_2.player===player){
        console.log('Submit current game player2: ',this.state.input_text)
        Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,this.props.task[0].player_2,this.state.input_text)
      }
      else if (this.props.task[0].player_3.player===player){
        console.log('Submit current game player3: ',this.state.input_text)
        Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,this.props.task[0].player_3,this.state.input_text)
      }
      else if (this.props.task[0].player_4.player===player){
        console.log('Submit current game player4: ',this.state.input_text)
        Meteor.call('tasks.updatePlayerText',this.props.task[0]._id,this.props.task[0].player_4,this.state.input_text)
        
      }
      */

  }

  resetRound(task_id) {
    const obj_array = [];

    this.props.task[0].players.map((play,index)=>{
      let obj_temp = {}
      console.log('index: ',index)
      console.log('player: ', play)
       obj_temp = {'ready':false, 'player':play,'pos':index+1, 'input_text':['%%']}
     obj_array.push(obj_temp)
    })

    Meteor.call('tasks.resetRound',task_id,obj_array);

  }

  renderResponses() {
    const aqui = this;
      const jugadores = this.props.task[0].players;
     return  jugadores.map((jug,ind) => {
       return (
      <div>
      <Row>
        <Col sm='12' >Player: {jug}</Col>
        <Col sm='12' >{aqui.props.task[0].blackcard}</Col>
      </Row>
      <Row>
      <Col sm='10'>{aqui.renderSpecificPlayer(ind,aqui)}</Col>
      <Col sm='2'>
        {!aqui.state.voted?<Button id={ind} onClick={(e)=> this.submitVote(e)}>Vote for me!</Button>:<div>{this.renderPlayerVotes(ind,aqui)}</div>}
      </Col>
      </Row>
      </div>
      )})
     }

  renderSpecificPlayer (ind,aqui) {

    const card_sub = this.props.task[0].blackcard

    console.log(card_sub)
      
      try {
      if(card_sub.split('_').length<=2) {
          if(ind===0) {
      return (<ListGroupItem key={ind}>{aqui.props.task[0].player_1.input_text[0]} </ListGroupItem>);
    } else if (ind===1) {
      return (<ListGroupItem key={ind}>{aqui.props.task[0].player_2.input_text[0]} </ListGroupItem>);
    } else if (ind===2) {
      return (<ListGroupItem key={ind}>{aqui.props.task[0].player_3.input_text[0]} </ListGroupItem>);
    } else if (ind===3) {
      return (<ListGroupItem key={ind}>{aqui.props.task[0].player_4.input_text[0]} </ListGroupItem>);
    }
      }
      else{
        if(ind===0) {
      return (<div>
        <ListGroupItem key={ind}>{aqui.props.task[0].player_1.input_text[0]} </ListGroupItem>
        <ListGroupItem key={ind}>{aqui.props.task[0].player_1.input_text2[0]} </ListGroupItem>
        </div>);
    } else if (ind===1) {
      return (<div>
        <ListGroupItem key={ind}>{aqui.props.task[0].player_2.input_text[0]} </ListGroupItem>
        <ListGroupItem key={ind}>{aqui.props.task[0].player_2.input_text2[0]} </ListGroupItem></div>);
    } else if (ind===2) {
      return (<div><ListGroupItem key={ind}>{aqui.props.task[0].player_3.input_text[0]} </ListGroupItem>
      <ListGroupItem key={ind}>{aqui.props.task[0].player_3.input_text2[0]} </ListGroupItem></div>);
    } else if (ind===3) {
      return (<div><ListGroupItem key={ind}>{aqui.props.task[0].player_4.input_text[0]} </ListGroupItem>
      <ListGroupItem key={ind}>{aqui.props.task[0].player_4.input_text2[0]} </ListGroupItem></div>);
    }
      }
    }
    catch(error){
        console.log('Trying to split when there is nothing to split')
    }
    

  }

  renderPlayerVotes (ind,aqui) {
    if(ind===0) {
      return (<div>{aqui.props.task[0].player_1votes}</div>);
    } else if (ind===1) {
      return (<div>{aqui.props.task[0].player_2votes}</div>);
    } else if (ind===2) {
      return (<div>{aqui.props.task[0].player_3votes}</div>);
    } else if (ind===3) {
      return (<div>{aqui.props.task[0].player_4votes}</div>);
    }
  }

  renderWaitForOthers(){
      return(<h3>Wait for other ppl to finish!  </h3>)
  }

  changeVote() {
    this.setState({
      voted:false
     });
  }
  renderGameBoard(){
    const aqui = this
    const curr_player = aqui.props.location.state.jugador.username
    if(this.props.task[0].game_on){
      console.log('sso renderBlock?Much')
      let obj_temp = {}
      console.log(aqui.props.location)
      console.log(curr_player)


      if(curr_player===aqui.props.task[0].player_1.player){
         obj_temp=  aqui.props.task[0].player_1
      //  return obj_temp
      }
    
      else if(curr_player===aqui.props.task[0].player_2.player){
         obj_temp = aqui.props.task[0].player_2
        //return obj_temp 
      }
    
      else if(curr_player===aqui.props.task[0].player_3.player){
         obj_temp = aqui.props.task[0].player_3
        //return obj_temp
      }
    
      else if(curr_player===aqui.props.task[0].player_4.player){
         obj_temp = aqui.props.task[0].player_4
       // return obj_temp
      }
        console.log('This actual player is: ', obj_temp)
      try{
        if (obj_temp.ready===false)
        {
          return aqui.renderAnswerBlocks(aqui.props.task[0].blackcard)
        }

        else if(this.props.task[0].player_1.input_text[0]!==undefined &&this.props.task[0].player_2.input_text[0]!==undefined &&this.props.task[0].player_3.input_text[0]!==undefined &&this.props.task[0].player_4.input_text[0]!==undefined ) {
          if(this.props.task[0].player_1.input_text[0]!== "%%" &&this.props.task[0].player_2.input_text[0]!=="%%" &&this.props.task[0].player_3.input_text[0]!=="%%" &&this.props.task[0].player_4.input_text[0]!=="%%" ) {
          return aqui.renderResponses();
          }
        }
        else{
          return aqui.renderWaitForOthers();
        }
      } catch (err) {
        () => {aqui.openModal()}
      }
      
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
    if(!this.props.task[0].player_1.ready||!this.props.task[0].player_2.ready||!this.props.task[0].player_3.ready||!this.props.task[0].player_4.ready)
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
  return  ( <Button color="success">
        voting!!
      </Button>)
    
  }
  renderJugador(jugadores) {
    console.log('render Jugador :',jugadores)
     return  jugadores.map((jug,ind) => {
       if(this.props.task[0].game_on)
       {
       return (<Row><Col sm='7'><ListGroupItem key={ind}>{jug} </ListGroupItem></Col><Col sm='5' key={ind} style={{'margin-top':'0.5rem'}}>{this.renderPlayerState(ind)}</Col></Row>)
       }
       else{
        return <ListGroupItem key={ind}>{ jug}</ListGroupItem>
       }
     }
      );
  }

  checkForWinner() {
    const numVotes = Number(this.props.task[0].player_1votes)+ Number(this.props.task[0].player_2votes)+ Number(this.props.task[0].player_3votes)+ Number(this.props.task[0].player_4votes)+1;
    console.log("votos primer",this.props.task[0].player_1votes);
    console.log("votos primer numer",Number(this.props.task[0].player_1votes));
    console.log("votos parse", parseInt(numVotes,10));
    console.log("votos parse2", parseInt(this.props.task[0].player_1votes,10));
    console.log("numero de votos", numVotes);

    const aqui = this;
      if(+numVotes===4)
      {

        this.getBlackCardGame();
        console.log("JAJAJAJAJAJAJJA");
        this.resetRound(this.props.task[0]._id);
      }
      
  }


  renderPlayers() {
    console.log('RenderPlayers: ', this.state.task)
    const {players} = this.props.task[0]

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
  const ownerName = this.props.task[0].username
  return <Container><Row><h2>Welcome to {ownerName}'s room, {playerName}</h2></Row>
  <Row style={{'textAllign':'center'}}>   
  {this.props.task[0].game_on?<h1>Be a prick!!</h1>:this.props.master?
  <Button className='welcomeBtn'onClick = {()=> this.gameBegin(this.props.task[0]._id)} outline color="success"  block>
  Start game!
  </Button>:<h3>Please wait until game begins</h3>}</Row> </Container>
}
  render() {
    console.log('Master of puppets render(): ', this.props.master)
    return (
      <div>


      <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h2 ref={subtitle => this.subtitle = subtitle}>Error!</h2>
          <div>Please, start the game with 4 players and then play</div>
          <button onClick={this.closeModal}>close</button>
          
          
        </Modal>


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
          <h2>Add your silly input</h2>
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
  console.log('player: ',player)
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
