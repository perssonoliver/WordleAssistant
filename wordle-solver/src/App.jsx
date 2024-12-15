import { useState, useEffect } from 'react'
import './App.css'
import dict from './dict.mjs'
import Keyboard from './Keyboard'
import MainGrid from './MainGrid'
import WordList from './WordList'

const BLACK   = 'rgb(59, 59, 59)'
const YELLOW  = 'rgb(204, 175, 13)'
const GREEN   = 'rgb(34, 150, 23)'
const COLORS = [BLACK, YELLOW, GREEN]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let wordLists = []
let letterFrequencies = {}
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
    const rowLetters = {}
    for (let i = 0; i < 5; i++) {
      rowLetters[i] = {
        letter: document.getElementById(`col${row}${i}`).value,
        color: colors[row][i]
      }
    }

    for (let i = 0; i < 5; i++) {
      const currLetter = rowLetters[i].letter
      const currColor = rowLetters[i].color

      if (rowLetters[i].color === BLACK) {
        console.log('found black')
        let yellowExists = false
        let greenExists = false
        let greenIndexes = []

        for (let j = 0; j < 5; j++) {
          if (rowLetters[j].letter === currLetter) {
            if (rowLetters[j].color === YELLOW) {
              yellowExists = true
            } else if (rowLetters[j].color === GREEN) {
              greenExists = true
              greenIndexes.push(j)
            } else {
              continue
            }
            break
          }
        }

        if (yellowExists) {
          for (let j = row; j < 6; j++) {
            validLetters[j][i] = validLetters[j][i].replace(currLetter, '')
            break
          }
        }

        if (greenExists) {
          for (let j = row; j < 6; j++) {
            for (let k = 0; k < 5; k++) {
              if (greenIndexes.includes(k)) {
                continue
              }
              validLetters[j][k] = validLetters[j][k].replace(currLetter, '')
            }
          }
          break
        }

        for (let j = row; j < 6; j++) {
          for (let k = 0; k < 5; k++) {
            validLetters[j][k] = validLetters[j][k].replace(currLetter, '')
          }
        }
      } else if (rowLetters[i].color === GREEN) {
        console.log('found green')
        for (let j = row; j < 6; j++) {
          validLetters[j][i] = currLetter
        }
      } else if (rowLetters[i].color === YELLOW) {
        console.log('found yellow')
        for (let j = row; j < 6; j++) {
          validLetters[j][i] = validLetters[row][i].replace(currLetter, '')
        }
      }
    }
    console.log(validLetters)
    updateFrequencies(rowLetters)

    // Filter the word list and save it in wordLists
    setWordList(wordLists[row])

    /*
    let newWords = [...Array((row + 1) * 2)]
    for (let i = 0; i < (row + 1) * 2; i++) {
      newWords[i] = dict[i]
    }
    setWordList(newWords)
    */
  }

  function updateFrequencies(rowLetters) {
    const letters = Object.values(rowLetters).map(item => item.letter)

    let duplicates = []
    let temp = []

    for (let i = 0; i < 5; i++) {
      const currLetter = rowLetters[i].letter
      if (singletons.includes(currLetter) && !duplicates.includes(currLetter)) {
        duplicates.push(currLetter)
      } else {
        singletons.push(currLetter)
      }
    }

    let singletons = temp.filter(item => !duplicates.includes(item))

    // Update singleton letters
    for (let i = 0; i < singletons.length; i++) {
      let currLetter = singletons[i]
      let currColor = ''
      for (let j = 0; j < 5; j++) {
        if (rowLetters[j].letter === currLetter) {
          currColor = rowLetters[j].color
          break
        }
      }
      if (currColor === GREEN ||  currColor === YELLOW) {
        if (!(currLetter in letterFrequencies)) {
          letterFrequencies[currLetter] = {
            atLeast: 1,
            atMost: 5
          }
        }
      }
    }

    // Update duplicate letters
    for (let i = 0; i < duplicates.length; i++) {
      let nbrColored = 0
      let nbrBlack = 0

      for (let j = 0; j < 5; j++) {
        if (rowLetters[j].letter === duplicates[i]) {
          if (rowLetters[j].color === BLACK) {
            nbrBlack++
          } else if (rowLetters[j].color === GREEN || rowLetters[j].color === YELLOW) {
            nbrColored++
          }
        }
      }

      letterFrequencies[duplicates[i]].atLeast = nbrColored
      if (nbrBlack > 0) {
        letterFrequencies[duplicates[i]].atMost = nbrColored
      } else {
        letterFrequencies[duplicates[i]].atMost = 5
      }
    }

    // Update upper bound of existing letters
    for (let i = 0; i < letterFrequencies.length; i++) {
      const currAtLeast = letterFrequencies[ALPHABET[i]].atLeast
      const totalAtLeast = Object
        .values(letterFrequencies)
        .map(item => item.atLeast)
        .reduce((acc, currentValue) => acc + currentValue, 0);
      letterFrequencies[ALPHABET[i]].atMost = 5 - totalAtLeast - currAtLeast
    }
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