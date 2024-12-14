import { useState, useEffect } from 'react'
import './App.css'
import dict from './dict.mjs'
import Keyboard from './Keyboard'
import MainGrid from './MainGrid'
import WordList from './WordList'

const COLORS = ['rgb(59, 59, 59)', 'rgb(204, 175, 13)', 'rgb(34, 150, 23)']

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let validLetters = initLetters()

function initLetters() {
  let letters = {}
  for (let i = 0; i < 6; i++) {
    letters[i] = {}
    for (let j = 0; j < 5; j++) {
      letters[i][j] = ALPHABET
    }
  }
  return letters
}

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
  const [row, setRow]           = useState(0);
  const [col, setCol]           = useState(0);
  const [colors, setColors]     = useState(defaultColors);
  const [wordList, setWordList] = useState([])

  function changeColor(target, row, col) {
    const color = colors[row][col]

    let newColor;
    if (color === '') {
      newColor = COLORS[0]
    } else {
      newColor = COLORS[(COLORS.indexOf(color) + 1) % COLORS.length]
    }

    const newColors = { ...colors, [row]: { ...colors[row], [col]: newColor } };
    setColors(newColors);

    target.style.backgroundColor = newColor
    target.style.borderColor = newColor
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
  
  function setBoxCharacter(event) {
    event.preventDefault()
    console.log(event.target.id)
  
    if (event.target.id === 'key_ENTER') {
      if (row == 4 || col != 5 || !rowColored()) {
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
  
    if (col == 5) {
      return
    }

    const char = event.target.id[4]
    const box = document.getElementById(`col${row}${col}`)
    box.value = char
    box.blur()
    setCol(col + 1)
  }

  function updateWordList() {
    const rowLetters = [...Array(5)]
    for (let i = 0; i < 5; i++) {
      rowLetters[i] = document.getElementById(`col${row}${i}`).value
    }

    for (let i = 0; i < 5; i++) {
      if (rowLetters[i] === '') {
        return
      }
    }




    let newWords = [...Array((row + 1) * 2)]
    for (let i = 0; i < (row + 1) * 2; i++) {
      newWords[i] = dict[i]
    }
    setWordList(newWords)
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
        <MainGrid changeColor={changeColor}/>
        <WordList wordList={wordList}/>
      </div>

      <Keyboard setBoxCharacter={setBoxCharacter}/>
    </>
  )
}

export default App;