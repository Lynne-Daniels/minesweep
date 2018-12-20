import React, { Component } from 'react';

class SelectGame extends Component {

  state = {game: 'beginner'};
  handleChange = (e) => {
    let game = e.target.value;
    console.log('changing', e.target, e.target.value, this.props.changeGame);
    this.setState({game: e.target.value}, this.props.changeGame.handleChange(game));

  }

  render() {
    return ( 
      <div>
        <h2>Select Game Size</h2>
        <form>
          <input type="radio" value="beginner" checked={this.state.game === 'beginner'} onChange={this.handleChange}/>Beginner
          <input type="radio" value="advanced" checked={this.state.game === 'advanced'} onChange={this.handleChange}/>Advanced
          <input type="radio" value="expert" checked={this.state.game === 'expert'} onChange={this.handleChange}/>Expert
        </form>


      </div>
    )
  }
}

export default SelectGame;
