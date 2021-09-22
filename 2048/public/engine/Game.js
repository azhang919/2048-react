export default class Game {
  constructor(size) {
    // Dimensions
    this.size = size < 2 ? 2 : size; // row and column length
    this.length = Math.pow(size, 2); // length of the 1D board array

    // Game state
    this.state = {
      board: null,
      score: 0,
      won: false,
      over: false,
    };
    this.resetBoard(this.length);

    // Callback functions
    this.moveCallbacks = [];
    this.winCallbacks = [];
    this.loseCallbacks = [];
  }

  /** SET UP ------------------------------------------------------------------------------ */

  setupNewGame() {
    this.resetBoard(this.length);
    [this.state.score, this.state.won, this.state.over] = [0, false, false];
    [this.moveCallbacks, this.winCallbacks, this.loseCallbacks] = [[], [], []];
  }

  resetBoard() {
    this.state.board = Array(this.length).fill(0);
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    if (this.state.over) return;
    let spaces = this.getSpaces();
    let sp = spaces[Math.floor(Math.random() * spaces.length)];
    this.state.board[sp] = Math.random() < 0.9 ? 2 : 4;
  }

  // Returns a list of blank space indexes
  getSpaces() {
    return this.state.over
      ? []
      : this.state.board.reduce((acc, val, i) => {
          if (val === 0) acc.push(i);
          return acc;
        }, []);
  }

  toString() {
    return this.state.board.reduce((acc, val, i) => {
      acc += "[" + (val || " ") + "]    ";
      if (i !== 0 && (i + 1) % 4 === 0) acc += "\n";
      return acc;
    }, "");
  }

  loadGame(gameState) {
    Object.keys(gameState).forEach((key) => (this.state[key] = gameState[key]));
  }

  getGameState() {
    return this.state;
  }

  /** MOVE --------------------------------------------------------------------------------- */

  move(direction) {
    if (this.state.over) return;

    // Move tiles
    if (this[`${direction}`]()) {
      this.addRandomTile();
      this.moveCallbacks.forEach((cb) => cb(this.getGameState()));
    }

    // Win condition
    if (this.state.won) {
      this.winCallbacks.forEach((cb) => cb(this.getGameState()));
    }

    // Lose condition
    if (this.checkGameOver()) {
      this.state.over = true;
      this.loseCallbacks.forEach((cb) => cb(this.getGameState()));
    }
  }

  left() {
    return this.movement(true, "L");
  }

  right() {
    return this.movement(true, "R");
  }

  up() {
    return this.movement(false, "L");
  }

  down() {
    return this.movement(false, "R");
  }

  /**
   * Implements game logic for moving tiles for rows/columns in all 4 directions
   * @param {boolean} isRow       indicates if rows (or columns) are to be shifted
   * @param {String} dir          "L" to shift/combine left, "R" to shift/combine right
   */
  movement(isRow, dir) {
    let newBoard = [];
    let moved = false;

    for (let i = 0; i < this.size; i++) {
      let vals = isRow ? this.getRow(i) : this.getCol(i);

      moved = this[`shift${dir}`](vals, moved);
      moved = this[`combineShift${dir}`](vals, moved);

      // If column, add onto new board as subarray
      if (isRow) {
        vals.map((v) => newBoard.push(v));
      } else {
        newBoard.push(vals);
      }
    }

    // If column, transpose and flatten 2D array
    this.state.board = isRow ? newBoard : this.transposeFlatten(newBoard);
    return moved;
  }

  /** HELPER MOVE METHODS ------------------------------------------------------------------ */
  /**
   * Shifts all values to their leftmost positions
   * @param {(number|Array)} vals     a row/column, as a list of values to be shifted
   * @param {boolean} moved           indicates if any previous movement occurred
   * @returns {boolean}   indicates if any values were shifted (i.e. if the state of the board changed)
   */
  shiftL(vals, moved) {
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] !== 0) continue;

      let j = i;
      for (; vals[j] === 0; j++);
      if (j < vals.length) {
        vals[i] = vals[j];
        vals[j] = 0;
        moved = true;
      }
    }
    return moved;
  }

  /**
   * Combines all equal-value pairs from left to right and shifts everything left
   * @param {(number|Array)} vals     a row/column, as a list of values to be shifted
   * @param {boolean} moved           indicates if any previous movement occurred
   * @returns {boolean}   shifts values and indicates if the state of the board changed
   */
  combineShiftL(vals, moved) {
    for (let j = 0; j < vals.length; j++) {
      if (vals[j] > 0 && vals[j] === vals[j + 1]) {
        vals[j] *= 2;
        vals[j + 1] = 0;
        moved = true;
        this.state.score += vals[j];
        if (vals[j] === 2048) this.state.won = true;
      }
    }
    return this.shiftL(vals, moved);
  }

  // Same logic as shiftL, only shifting to the right
  shiftR(vals, moved) {
    for (let i = vals.length - 1; i >= 0; i--) {
      if (vals[i] !== 0) continue;

      let j = i;
      for (; vals[j] === 0; j--);
      if (j >= 0) {
        vals[i] = vals[j];
        vals[j] = 0;
        moved = true;
      }
    }
    return moved;
  }

  // Same logic as combineL, only combining from right to left and shifting right
  combineShiftR(vals, moved) {
    for (let j = vals.length - 1; j >= 0; j--) {
      if (vals[j] > 0 && vals[j] === vals[j - 1]) {
        vals[j] *= 2;
        vals[j - 1] = 0;
        moved = true;
        this.state.score += vals[j];
        if (vals[j] === 2048) this.state.won = true;
      }
    }
    return this.shiftR(vals, moved);
  }

  getRow(idx) {
    return this.state.board.slice(idx * this.size, (idx + 1) * this.size);
  }

  getAllRows() {
    return this.state.board.reduce((acc, v, i) => {
      if (i < this.size) acc.push(this.getRow(i));
      return acc;
    }, []);
  }

  getCol(idx) {
    return this.state.board.filter((_, i) => (i - idx) % this.size === 0);
  }

  // Changes rows into columns and flattens a 2D array
  transposeFlatten(board) {
    return board[0]
      .map((_, colIndex) => board.map((row) => row[colIndex]))
      .flat();
  }

  /** EVENT CHECKERS/HANDLERS --------------------------------------------------------------- */
  onMove(callback) {
    this.moveCallbacks.push(callback);
  }

  onWin(callback) {
    this.winCallbacks.push(callback);
  }

  onLose(callback) {
    this.loseCallbacks.push(callback);
  }

  checkGameOver() {
    if (this.state.over) return true;
    for (let i = 0; i < this.size; i++) {
      if (this.canMove(this.getRow(i)) || this.canMove(this.getCol(i)))
        return false;
    }
    return true;
  }

  /**
   * Helper method for checking if the game is over
   * @param {(number|Array)} vals     a row/column, as a list of values
   * @returns {boolean}               indicates if any values can be shifted/combined in any direction
   */
  canMove(vals) {
    return vals.some((v, i) => v === 0 || v === vals[i + 1]);
  }
}
