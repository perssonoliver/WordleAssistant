import { useState, useEffect } from 'react'
import './App.css'
import Keyboard from './Keyboard'
import MainGrid from './MainGrid'
import WordList from './WordList'

function defaultColors() {
  const colors = {};
  for (let i = 0; i < 6; i++) {
    colors[i] = {};
    for (let j = 0; j < 5; j++) {
      colors[i][j] = '';
    }
  }
  return colors;
}

function App() {
  const [row, setRow]       = useState(0);
  const [col, setCol]       = useState(0);
  const [colors, setColors] = useState(defaultColors);

  function getColor(row, col) {
    return colors[row][col];
  }

  function changeColor(row, col, newColor) {
    const newColors = { ...colors, [row]: { ...colors[row], [col]: newColor } };
    setColors(newColors);
  }
  
  function setBoxCharacter(event) {
    event.preventDefault()
    console.log(event.target.id)
  
    if (event.target.id === 'key_ENTER') {
      if (row == 5 || col != 5 || !rowColored()) {
        return
      }

      updateWordList()
      setRow(row + 1)
      setCol(0)
      return
    } 
  
    if (event.target.id === 'key_DEL') {
      if (col == 0) {
        return
      }

      const box = document.getElementById(`col${row}${col - 1}`)
      box.value = ''
      box.blur()
      setCol(col - 1)
      return
    }
  
    const char = event.target.id[4]
    if (col == 5) {
      return
    }
    const box = document.getElementById(`col${row}${col}`)
    box.value = char
    box.blur()
    setCol(col + 1)
  }

  function rowColored() {
    for (let i = 0; i < 5; i++) {
      const color = colors[row][i]
      if (color === '') {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    const firstInput = document.getElementById('col00');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  return (
    <>
      <div className='container'>
        <MainGrid changeColor={changeColor} getColor={getColor}/>
        <WordList />
      </div>

      <Keyboard setBoxCharacter={setBoxCharacter}/>
    </>
  )
}

export default App;