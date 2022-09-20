import { useState } from 'react';
import Confetti from 'react-confetti'
import './App.css';

const BOARD_SIZE = 3;

enum Cell {
  Empty = '',
  X = 'X',
  O = 'O',
}

const initialBoard = new Map<string, Cell>();

for (let i = 0; i < BOARD_SIZE; i++) {
  for (let j = 0; j < BOARD_SIZE; j++) {
    initialBoard.set(`${i}_${j}`, Cell.Empty);
  }
}

const isHorizontalWinner = (board: Map<string, Cell>, lastRow: number, lastCol: number) => {
  const lastCell = board.get(`${lastRow}_${lastCol}`);

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board.get(`${lastRow}_${i}`) !== lastCell) {
      return false;
    }
  }

  return true;
};

const isVerticalWinner = (board: Map<string, Cell>, lastRow: number, lastCol: number) => {
  const lastCell = board.get(`${lastRow}_${lastCol}`);

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board.get(`${i}_${lastCol}`) !== lastCell) {
      return false;
    }
  }

  return true;
};

const isDiagonalWinner = (board: Map<string, Cell>, lastRow: number, lastCol: number) => {
  const lastCell = board.get(`${lastRow}_${lastCol}`);

  if (lastRow === lastCol) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (board.get(`${i}_${i}`) !== lastCell) {
        return false;
      }
    }
  } else {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (board.get(`${i}_${BOARD_SIZE - 1 - i}`) !== lastCell) {
        return false;
      }
    }
  }

  return true;
};

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isXTurn, setIsXTurn] = useState(Math.random()>=0.5);
  const [winner, setWinner] = useState<Cell>(Cell.Empty);
  const [isDraw, setIsDraw] = useState(false);

  return (
    <div className="App">
      <h2>
        {winner !== Cell.Empty ? (
          <>
            <span>{winner} won!</span>
            <Confetti />
          </>
        ) : isDraw ? (
          <span>Draw!</span>
        ) : (
          <span>{isXTurn ? 'X' : 'O'} Turn</span>
        )}
      </h2>
      <div
        className={ `board ${isXTurn ? 'x-turn' : 'o-turn'}` }
        style={ { width: `${(BOARD_SIZE * 100) + (BOARD_SIZE - 1) * 5}px` } }
      >
        {Array.from(board.entries()).map(([key, value]) => (
          <button
            key={key}
            className={`cell${value !== Cell.Empty ? ` cell-${value.toLowerCase()}` : ''}`}
            disabled={value !== Cell.Empty || winner !== Cell.Empty}
            onClick={() => {
              const newBoard = new Map(board).set(key, isXTurn ? Cell.X : Cell.O);
              setBoard(newBoard);

              const [row, col] = key.split('_').map(Number);

              if (isHorizontalWinner(newBoard, row, col) || isVerticalWinner(newBoard, row, col) || isDiagonalWinner(newBoard, row, col)) {
                setWinner(isXTurn ? Cell.X : Cell.O);
                return;
              }

              if (!Array.from(newBoard.values()).some( cell => cell === Cell.Empty)) {
                setIsDraw(true);
                return;
              }

              setIsXTurn(!isXTurn);
            }}
            type="button"
          >
            {value && <span className="sr-only">{value}</span>}
          </button>
        ))}
      </div>
      <button
        className="restart-game"
        type="button"
        onClick={() => {
          setBoard(initialBoard);
          setIsXTurn(Math.random()>=0.5);
          setWinner(Cell.Empty);
          setIsDraw(false);
        }}
      >
        Restart game
      </button>
    </div>
  )
}

export default App;
