// start @ 18-12-2020 22.20
// parse 1 end @ 19-12-2020 00.14
import React,{ useContext, createContext, useReducer } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './App.css'

// Context
const defautlBoard = {
  pointer: 0,
  tiles: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  sum: [0, 0, 0, 0, 0, 0, 0, 0]
}
const AppContext = createContext(defautlBoard)

// Reducer
const SET_TILE = "setTile"
const RESET_BOARD = "resetBoard"

const checkAnswer = (tiles) => {
  let answer = [0, 0, 0, 0, 0, 0, 0, 0]
  if (tiles.length === 9) {
    //1 : 0 1 2
    answer[0] = getSumFromArray(tiles, [0,1,2])
    //2 : 3 4 5
    answer[1] = getSumFromArray(tiles, [3,4,5])
    //3 : 6 7 8
    answer[2] = getSumFromArray(tiles, [6,7,8])
    //4 : 0 3 6
    answer[3] = getSumFromArray(tiles, [0,3,6])
    //5 : 1 4 7
    answer[4] = getSumFromArray(tiles, [1,4,7])
    //6 : 2 5 8
    answer[5] = getSumFromArray(tiles, [2,5,8])
    //7 : 0 4 8
    answer[6] = getSumFromArray(tiles, [0,4,8])
    //8 : 6 4 2
    answer[7] = getSumFromArray(tiles, [6,4,2])
  }
  return answer
}

const getSumFromArray = (array, targetIndexs) => {
  return array.filter((v, i) => targetIndexs.includes(i))
    .reduce((a, c) => a + c)
}

const appReducer = (state, action) => {
  switch (action.type) {
    case SET_TILE: {
      let newValue = {
        tiles: state.tiles.map((tileValue, index) => {
          if (index === action.index) return action.value
          else return tileValue
        }),
        pointer: state.pointer + 1
      }
      newValue.sum = checkAnswer(newValue.tiles)
      console.log(newValue)
      return newValue
    }
    case RESET_BOARD: {
      let newValue = {
        tiles: defautlBoard.tiles.map((tileValue, index) => {
          if (index === action.index) return defautlBoard.pointer + 1
          else return tileValue
        }),
        pointer: defautlBoard.pointer + 1
      }
      newValue.sum = checkAnswer(newValue.tiles)
      return newValue
    }
    default: return state
  }
}

// Action
const setTileAction = (index, value, reset) => {
  return {
    type: !reset ? SET_TILE : RESET_BOARD,
    index: index,
    value: value
  }
}


// Component : Tile
const Tile = (props) => {
  const { index, number } = props
  const [board, dispatchBoard] = useContext(AppContext)

  const clickHandle = () => {
    const newGame = board.pointer === 9
    const canChangeValue = board.tiles[index] === 0

    if (canChangeValue || newGame) {
      dispatchBoard(setTileAction(index, board.pointer + 1, newGame))
    }
  }

  return (
    <div className="tile" onClick={clickHandle}>
      { number}
    </div>
  )
}

// Component : Block
const BlockLine = (props) => {
  const { begin, end } = props
  const [board] = useContext(AppContext)

  return (
    <div className="block">
      { board.tiles.filter((t, i) => i >= begin && i <= end)
        .map((tile, index) => {
          return <Tile index={begin + index} number={tile} key={`tile-${index}`} />
        })
      }
    </div>
  )
}

// Component : Board
const Board = () => {
  return (
    <div className="board">
      <BlockLine begin={0} end={2} />
      <BlockLine begin={3} end={5} />
      <BlockLine begin={6} end={8} />
    </div>
  )
}

// Component : Sum Label
const SummaryLabel = () => {
  const [board] = useContext(AppContext)

  return (<div className="block">
    <ul>
      {board.sum?.map( (value, index)=> <li key={`li-${index}`}>{`summary of line ${index} is ---------> ${value}`}</li>)}
    </ul>
  </div>)
}

// Component : App
const App = () => {
  const [board, dispatchBoard] = useReducer(appReducer, defautlBoard)

  return (
    <AppContext.Provider value={[board, dispatchBoard]}>
      <div className="App App-header">
        <Board />
        <SummaryLabel />
      </div>
    </AppContext.Provider>
  );
}


// React DOM Render
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


