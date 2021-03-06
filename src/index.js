import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.isPoint !== -1 ? 'point' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        isPoint={this.props.point.indexOf(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const array = Array(3).fill(Array(3).fill(null))
    return (
      <div>
        {
          array.map((item, index1) => {
            return (
              <div className="board-row" key={index1}>
                {
                  item.map((item, index2) => {
                    return this.renderSquare(index1 * 3 + index2)
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      locate: [],
      xIsNext: true,
      reverse: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      locate: this.state.locate.concat([
        `(${Math.round(i / 3)}, ${i % 3 + 1})`
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  order () {
    this.setState({reverse: !this.state.reverse})
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).winner : null;
    const point = calculateWinner(current.squares) ? calculateWinner(current.squares).point : [];
    const locate = this.state.locate;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move:
        'Go to game start';
      return (
        <li key={move}>
          <span className={`btn ${move === stepNumber ? 'active' : ''}`} onClick={() => this.jumpTo(move)}>{desc}</span>
          {
            move !== 0 && <p>第{move}步：{locate[move - 1]}</p>
          }
        </li>
      );
    });
    if (this.state.reverse) {
      moves.reverse()
    }
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (stepNumber === 9) {
      status = "平局";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            point={point}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <p onClick={() => this.order(moves)} style={{marginBottom: '20px'}}>切换顺序</p>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], point: [a, b, c]};
    }
  }
  return null;
}