import React, { Component } from 'react';
import './Game.css';
import Timer from './Timer';
import {  Container, Row, Col,Button, Label, Input } from 'reactstrap';

class Game extends Component {
  constructor(props) {

    super(props);



    this.state = {
      cards:[],
      turn:0,
      players:[{name:'test',inputs:{input1:'',input2:''}}]
    };
    this.handleChangeInput1 = this.handleChangeInput1.bind(this);
  }


  handleChangeInput1(evt){
    console.log(`Input 1: ${evt.target.value}`)
  


  }
  handleChangeInput2(evt){
    console.log(`Input 2: ${evt.target.value}`)
  }

    updateCardState = ()=>{
    this.setState({cards:this.props.location.state.cartas_game})
  }

  getBlackCardGame(){
    console.log('Entra a black')
    if(this.state.cards.length!==0)
    {
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



  submitCurrentGame(){

  }

  componentDidMount(){
    if(this.state.cards.length===0){
      this.updateCardState();
    }
  }
  render() {
    return (
      <div>
        <div className="panel panel-default cronometer center-block">
          <div className="panel-body">
            <Timer/>
            {this.getBlackCardGame()}
            {this.submitCurrentGame()}
          </div>
        </div>
      </div>
    );  
  }
}

export default Game;
