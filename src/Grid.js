import React, { Component } from 'react';
import Square from './Square.js';

class Grid extends Component {

   constructor(props) {
    super(props);
    this.height = 17;
    this.width = 31;
    this.state = {
      grid: this.makeGrid(this.width, this.height)
    }
    this.clearSquare = this.clearSquare.bind(this);
    this.sweep = this.sweep.bind(this);
  }

  clearSquare(row, col, cb = () => {}) {
    this.setState((prevState) => {
      const newGrid = [...prevState.grid];
      newGrid[row][col].isCleared = true;
      console.log('newGrid isCleared??? ', newGrid[row][col].isCleared);
      return {grid: newGrid};
    }, cb)
  }
  
  // when a clear square is cleared, reveal all adjacent squares above and below
  // recursive? need to travel on all paths of clear squares, vert horiz and diag.
  sweep(row, col, e) {
    console.log('inside sweep: ', this.state.grid, col, row);
    if (this.state.grid[row][col].isCleared) {
      return;
    }
    const sweepNeighbors = () => {
      console.log('outside sweepNeighbors: ', row, col);
      return (() => {
        console.log('inside sweepNeighbors: ', row, col);
        const rowAbove = row - 1;
          const rowBelow = row + 1;
          for (let c = col -1; c < col + 2; c++) {
            this.sweep(rowAbove, c);
            this.sweep(rowBelow, c);
          }
          this.sweep(row, col - 1);
          this.sweep(row, col + 1);
      })();
    }
    // if square does not exist, ignore it
    if (row < 0 || row > this.height|| col < 0 || col > this.width) {
      return;
    }
    const square = this.state.grid[row][col];
    console.log('clearing from: ', square, square.isCleared);
    if (square.val === 'mine' && e && e.type === 'click') {
      this.clearSquare(row, col);
      console.log('🔥KaBoom🔥'); // TODO END GAME
      return;
    }
    
    // if it is a square and is blank, clear it
    if (square.count > 0) {
      this.clearSquare(row, col);
      return;
    }
    // if it is also 0 count, clear the neighbors too.
    if (square.val === 'blank' && !this.state.grid[row][col].isCleared) {
      // clear squares around the mine-free area
      console.log('Before --- isCleared??? ', this.state.grid[row][col].isCleared);
      this.clearSquare(row, col);
      this.clearSquare(row, col, sweepNeighbors);
      console.log('After --- isCleared??? ', this.state.grid[row][col].isCleared)
      setTimeout(() => console.log('After 1 second --- isCleared??? ', this.state.grid[row][col].isCleared), 1000);

      
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
          isCleared: false,
          handleClick : (e, ss) => {
            console.log(ss.row, ss.col, 'was clicked')
            // this.clearSquare(ss.row, ss.col);
            this.sweep(ss.row, ss.col, e);
            // if (ss.val === 'blank' && ss.count === 0) {
            //   console.log('blank clicked');
            //   let clearRow = ss.row;
            //   let clearCol = ss.col;
            //   while (grid[clearRow + 1]) {
            //     // if (true) {
            //     if(grid[clearRow + 1][clearCol].val === 'blank'){
            //       console.log('TODO figure out how to change state of this thing', clearRow);
            //       // grid[clearRow + 1][clearCol].isCleared = true;
            //       clearRow++;
            //       this.clearSquare(clearRow, clearCol)
            //       if (grid[clearRow][clearCol].count !== 0) {
            //         break;
            //       }
            //     } else {
            //       // clearRow++;
            //       break;
            //     }
            //   }
            // }
          }
        }
        square.handleClick = square.handleClick.bind(square);
        rowArr.push(square);
      }
      grid.push(rowArr);
    }
    // add mines
    for (let count = 0; count < 99; count++) {
      let randRow = Math.floor(Math.random() * height);
      let randCol = Math.floor(Math.random() * width);
      if (grid[randRow][randCol].val === 'blank') {
        grid[randRow][randCol].val = 'mine';
        grid[randRow][randCol].char = '🔥'
      } else {
        count--;
      }
    }
    // test count Mines
    let countMines = grid.reduce((acc, row) => {
      return acc + row.reduce((a, v) => v.val === 'mine' ? a + 1 : a + 0, 0)
    }, 0)
    console.log('countMines: ', countMines);
    // add numbers
    // loop over all the squares
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
  //  const grid = this.makeGrid(30, 16);

   return(


    <div>
      {this.state.grid.map((row, idx) => this.makeRow(row, idx))}
    </div>
   )
  }
}

export default Grid;