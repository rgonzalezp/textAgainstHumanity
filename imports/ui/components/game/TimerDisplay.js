import React, { Component } from 'react';

class TimerDisplay extends Component {

  constructor(props){
    super(props);

  }


  leftPad = (value) => {
    if (value < 10 ) return `0${value}`;
    return `${value}`;
  };

  render() {
    console.log(this.props.currentTime)
    return (
      <div className="row">
        <h1 className="text-center">{`${this.leftPad(this.props.currentTime.get('minutes'))}:${this.leftPad(this.props.currentTime.get('seconds'))}`}</h1>
      </div>
    );
  }
}

export default TimerDisplay;
