import React, { Component } from 'react';
import Square from './Square.js';
import Instructions from './Instructions.js';
import SelectGame from './SelectGame.js';

class Grid extends Component {

   constructor(props) {
    super(props);
    this.faces = {
      newGame: '😀',
      winner: '😎',
      loser: '😖'
    }
    this.gameOptions = {
      beginner: {
        height: 9,
        width: 9,
        totalNumMines: 10,
        blankSquares: 71
      },
      advanced: {  // TODO look up traditional sizes online
        height: 16,
        width: 16,
        totalNumMines: 40,
        blankSquares: 216
      },
      expert: {
        height: 16,
        width: 30,
        totalNumMines: 99,
        blankSquares: 381
      }
    }
    this.changeGame = {
      handleChange: ((game) => {
      console.log('Game options clicked', game)
      clearInterval(this.state.timer);
      this.setState((prevState) => {
        let newState = {...prevState};
        return {
          ...newState,
          ...this.gameOptions[game]
        }
        }, this.initializeGame())
      })
    }
    // this.height = 9;
    // this.width = 9;
    // this.blankSquares = 71
    // this.numMines = 10
    this.state = {
      height: 9,
      width: 9,
      totalNumMines: 10,
      blankSquares: 71,
      face: this.faces.newGame,
      grid: [],
      numMines: this.numMines,
      seconds: 0,
      timer: null,
      unclearedNonMinedSquares: this.blankSquares
    }
    // this.clearSquare = this.clearSquare.bind(this);
    // this.sweep = this.sweep.bind(this);
  }

  componentDidMount() {
    this.initializeGame();
  }

  initializeGame() {
    console.log('initializing', this.state)
    this.setState((prevState) => {
      const newState = {...prevState};
      newState.grid = this.makeGrid(this.state.width, this.state.height);
      return {
        newState,
        grid: newState.grid,
        face: this.faces.newGame,
        numMines: this.state.totalNumMines,
        seconds: 0,
        unclearedNonMinedSquares: this.state.blankSquares
      };
    })
  }

  startTimer() {
    this.setState((prevState) => {
      return {
        seconds: prevState.seconds + 1
      }
    });
  }

  changeGridSize(size) {  // beginner, advanced, expert
    
  }

  endGameIfWon() {
    // TODO make the inefficient recursive function to clear squares faster, then keep a 
    // running total of clearedsquares, measure how much faster that is than recalculating all the time
    // project: set up a dashboard to measure and visualize the difference before fixing
    const countClearedSquares = () => {
      return this.state.grid.reduce((total, row) => {
        return total + row.reduce((subTotal, square) => {
          if (square.isCleared && square.val === 'blank') {
            return subTotal + 1;
          }
          return subTotal;
        }, 0) 
      }, 0)
    }
    if (countClearedSquares() === this.state.unclearedNonMinedSquares) {
      this.endGame(true);
    }
  }

  endGame(isWin){
    // stop timer
    clearInterval(this.state.timer);
    // lock squares and show all mines
    if (true) {
      this.setState((prevState) => {
        const newState = {...prevState}
        newState.grid = prevState.grid.map((row) => row.map((square) => {
          square.isActive = false;
          if (square.val === 'mine' && square.char !== '🚩') {
            square.char = isWin ? '🚩' : '💣'
            square.isCleared = true;
          }
          if (square.val === 'blank' && square.char === '🚩') {
            square.char = '❌'
          }
          return square;
        }))
        newState.face = isWin ? this.faces.winner : this.faces.loser;
        newState.timer = null;
        return newState;
      })
    }
  }
  
  startGame(){
    let timer = setInterval(() => {
      this.startTimer();
    }, 1000);
    return timer;
  }

  labelMine(row, col) {
    this.setState((prevState) => {
      const newGrid = [...prevState.grid];
      let newNumMines = [prevState.numMines];
      const currentSquare = prevState.grid[row][col];
      // toggle mine off
      if (currentSquare.isCleared === true && currentSquare.char === '🚩') {
        newNumMines++;
        if (currentSquare.val === 'blank') {
          newGrid[row][col].char = currentSquare.count > 0 ? currentSquare.count.toString() : '💦';
        } else {
          newGrid[row][col].char = '🚩';
        }
        newGrid[row][col].isCleared = false;
      // toggle mine on
      } else {
        newNumMines--;
        newGrid[row][col].char = '🚩';
        newGrid[row][col].isCleared = true;
      }
      return {
        grid: newGrid,
        numMines: newNumMines
      };
    })
  }
  clearSquare(row, col, cb = () => {}) {
    this.setState((prevState) => {
      const newGrid = [...prevState.grid];
      newGrid[row][col].isCleared = true;
      newGrid[row][col].isActive = false;
      return {grid: newGrid};
    }, cb)
  }
  
  // when a clear square is cleared, reveal all adjacent squares above and below
  // recursively travel on all paths of clear squares, vertical, horizontal, and diagonal.
  sweep(row, col, e) {
    // if square does not exist, ignore it
    if (row < 0 || row > this.state.height|| col < 0 || col > this.state.width) {
      return;
    }
    if (this.state.grid[row][col].isCleared) {
      return;
    }
    const sweepNeighbors = () => {
      return (() => {
        const rowAbove = row - 1;
        const rowBelow = row + 1;
        for (let c = Math.max(0, col - 1); c < Math.min(this.state.width, col + 2); c++) {
          if (rowAbove >= 0) {
            this.sweep(rowAbove, c);
          }
          if (rowBelow < this.state.height) {
            this.sweep(rowBelow, c);
          }
        }
        if (col >= 1) {
          this.sweep(row, col - 1);
        }
        if (col < this.state.width - 1) {
          this.sweep(row, col + 1);
        }
      })();
    }
    const square = this.state.grid[row][col];
    if (square.val === 'mine' && e && (e.type === 'click' || e.type === 'mousedown')) {
      this.clearSquare(row, col);
      this.setState((prevState) => {
        const newState = {...prevState};
        newState.grid[row][col].char = '🔥';
        return {grid: newState.grid};
      })
      this.endGame(false);
      return;
    }
    // if it is a square and is blank, clear it
    if (square.count > 0) {
      this.clearSquare(row, col, this.endGameIfWon);
      return;
    }
    // if it is also 0 count, clear the neighbors too.
    if (square.val === 'blank' && !this.state.grid[row][col].isCleared) {
      // clear squares around the mine-free area
      this.clearSquare(row, col);
      this.clearSquare(row, col, sweepNeighbors);
    }
    return;
  }

  makeGrid(width, height) {
    const grid = [];
    for (let row = 0; row < height; row++) {
      const rowArr = [];
      for (let col = 0; col < width; col++) {
        const square = {
          row,
          col,
          val: 'blank',
          char: '💦',
          count:0,
          isActive: true,
          isCleared: false,
          handleClick : (e, ss) => {
            e.preventDefault();
            if (this.state.timer === null & this.state.grid[ss.row][ss.col].val === 'blank') {
              this.setState({timer: this.startGame()});
            }
            if (this.state.grid[ss.row][ss.col].isActive) {
              if (e.button === 0) {
                this.sweep(ss.row, ss.col, e);
              }
              if (e.button === 2) {
                this.labelMine(ss.row, ss.col, e);
              }
            }
          },
        }
        square.handleClick = square.handleClick.bind(square);
        rowArr.push(square);
      }
      grid.push(rowArr);
    }

    // add mines
    for (let count = 0; count < this.state.totalNumMines; count++) {
      let randRow = Math.floor(Math.random() * height);
      let randCol = Math.floor(Math.random() * width);
      if (grid[randRow][randCol].val === 'blank') {
        grid[randRow][randCol].val = 'mine';
        grid[randRow][randCol].char = '💣'
      } else {
        count--;
      }
    }

    // loop over all the squares adding numbers
    grid.forEach((row, rowIdx, arr) => {
      row.forEach((col, colIdx) => {
        // loop over neighboring squares
        const topRow = rowIdx - 1;
        const bottomRow = rowIdx + 1;
        const leftCol = colIdx - 1;
        const rightCol = colIdx + 1;
        for (let r = topRow; r <= bottomRow; r++) {
          for (let c = leftCol; c <= rightCol; c++) {
            if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || (r === rowIdx && c === colIdx)) {
              // do nothing - ignore self and ignore off the grid cells
            } else if (grid[r][c].val === 'mine') {
              // if neighboring square exists and has mine: count++
              grid[rowIdx][colIdx].count++;
            }
          }
        }
        if (grid[rowIdx][colIdx].val !== 'mine' && grid[rowIdx][colIdx].count !== 0)
        grid[rowIdx][colIdx].char = grid[rowIdx][colIdx].count.toString();
      })
    })
    return grid;
  }

  makeRow(row, idx) { 
    return (
      <div className="row" key={idx}>
      {row.map((val) => {
        return <Square key={val.row + '-' + val.col} squareStuff={val} char={'g'}/>
      })}
      </div>
    )
  }
  render() {
   return(
    <div className="container">
      <SelectGame gameOptions={this.gameOptions} changeGame={this.changeGame}/>
      <header>
        <div className="scoreboard">
          <div className="score-title">Mines</div>
          <div className="score-item">{this.state.numMines} </div>
        </div>
        <button onClick={()=>this.initializeGame()}>{this.state.face}</button>
        <div className="scoreboard">
          <div className="score-title">Timer</div>
          <div className="score-item">{this.state.seconds} </div>
        </div>
      </header>
      <main className="centered">
      {this.state.grid.map((row, idx) => this.makeRow(row, idx))}
      </main>
      <div>
        <Instructions />
      </div>
    </div>
   )
  }
}

export default Grid;