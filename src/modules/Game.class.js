'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || this.createEmptyBoard();
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    let moved = false;

    this.board = this.board.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
          moved = true;
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      if (JSON.stringify(filteredRow) !== JSON.stringify(row)) {
        moved = true;
      }

      return filteredRow;
    });

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameWin();

    this.checkGameOver();

    return moved;
  }
  moveRight() {
    let moved = false;

    this.board = this.board.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i - 1, 1);
          moved = true;
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.unshift(0);
      }

      if (JSON.stringify(filteredRow) !== JSON.stringify(row)) {
        moved = true;
      }

      return filteredRow;
    });

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameWin();
    this.checkGameOver();

    return moved;
  }
  moveUp() {
    let moved = false;
    const transposedBoard = this.transpose(this.board);

    const updatedBoard = transposedBoard.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
          moved = true;
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      if (JSON.stringify(filteredRow) !== JSON.stringify(row)) {
        moved = true;
      }

      return filteredRow;
    });

    this.board = this.transpose(updatedBoard);

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameWin();

    this.checkGameOver();

    return moved;
  }
  moveDown() {
    let moved = false;

    let transposed = this.transpose(this.board);

    transposed = transposed.map((row) => {
      const reversedRow = row.reverse();
      const filteredRow = reversedRow.filter((cell) => cell !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
          moved = true;
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      if (JSON.stringify(filteredRow) !== JSON.stringify(reversedRow)) {
        moved = true;
      }

      return filteredRow.reverse();
    });

    this.board = this.transpose(transposed);

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameWin();

    this.checkGameOver();

    return moved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  restart() {
    this.start();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({
            row, col,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameOver() {
    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.board[i][j];

        if (
          (i > 0 && current === this.board[i - 1][j])
          || (j > 0 && current === this.board[i][j - 1])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  checkGameWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
}

module.exports = Game;
