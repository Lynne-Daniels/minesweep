import React, {Component} from 'react';

class Square extends Component {

  handleClick (e) {
    e.preventDefault();
    console.log('button: ', e.button);
    this.props.squareStuff.handleClick(e, this.props.squareStuff);
  }

  render () {

    return (
      <div>
        <div className="square" onMouseDown={this.handleClick.bind(this)}>{this.props.squareStuff.isCleared ? this.props.squareStuff.char : ''}</div>
      </div>
    );
  }
}

export default Square;