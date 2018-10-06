import React, { Component } from 'react';
import {Button} from 'reactstrap';
import TimerDisplay from './TimerDisplay';
import moment from 'moment';
import * as timerStates from './timerStates';
class Timer extends Component {
  constructor(){
    super();

    this.state= {
      currentTime: moment.duration( 3 , 'minutes' ),
      baseTime: moment.duration( 3 , 'minutes' ),
      timerState: timerStates.NOT_SET,
      timer:null,
    };

    this.setBaseTime = this.setBaseTime.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.reduceTimer = this.reduceTimer.bind(this);
  }

  setBaseTime(newBaseTime) {
    this.setState({
      baseTime: newBaseTime,
      currentTime: newBaseTime
    });
  }

  startTimer() {
    this.setState({
      timerState:timerStates.RUNNING,
      timer: setInterval(this.reduceTimer, 1000)
    });
  }

  reduceTimer() {
  	const newTime = moment.duration(this.state.currentTime);
  	newTime.subtract( 1 , 'second' );

  	this.setState({
  		currentTime: newTime,
  	});
  }

  handleChange(event) {
    const newBaseTime = this.state.baseTime;

    if (event.target.id === 'minutes' ) {
      newBaseTime.subtract(newBaseTime.get('minutes'),'minutes').add(parseInt(event.target.value), 'minutes' );
    }

    this.setBaseTime(newBaseTime);
    

  }

  render() {
    return (
      <div>
        <h1>This is a game</h1>
        <div className="container-fluid">
          <TimerDisplay currentTime={this.state.currentTime}/>
          <div className="row">
            <h2 className="text-primary">Set Round Time</h2>
          </div>
          <div className="row">
            <div className="form-group">
              <div className="col-sm-3">
                <label htmlFor="minutes">Minutes</label>
              </div>
              <div className="col-sm-6">
                <input id="minutes" className="form-control" type="number" onChange={this.handleChange}/>
              </div>
              <div className="col-sm-3">
                <Button className="btn btn-success" onClick={this.startTimer}>
                Start
                </Button>
              </div>
            </div>
          </div>
        </div>		
      </div>
    );
  }
}

export default Timer;
