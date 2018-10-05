import React, { Component } from 'react';
import {Button} from 'reactstrap';
class Timer extends Component {
  render() {
    return (
      <div>
        <h1>This is a game</h1>
        <div className="container-fluid">
          <div className="row">
            <h1 className="text-center">00:00:00</h1>
          </div>
          <div className="row">
            <h2 className="text-primary">Set Timer</h2>
          </div>
          <div className="row">
            <div className="form-group">
              <div className="col-sm-3">
                <label htmlFor="minutes">Minutes</label>
              </div>
              <div className="col-sm-6">
                <input id="minutes" className="form-control" type="number"/>
              </div>
              <div className="col-sm-3">
                <Button className="btn btn-success">
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
