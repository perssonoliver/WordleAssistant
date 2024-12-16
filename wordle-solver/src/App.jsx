import { useState, useEffect } from 'react'
import './App.css'
import dict from './dict.mjs'
import Keyboard from './Keyboard'
import MainGrid from './MainGrid'
import WordList from './WordList'

const GREY_HIGHLIGHT = 'rgb(90, 90, 90)'
const BLACK   = 'rgb(59, 59, 59)'
const YELLOW  = 'rgb(181, 159, 59)'
const GREEN   = 'rgb(83, 141, 78)'
const COLORS  = [BLACK, YELLOW, GREEN]

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

function App() {
  const [row, setRow]           = useState(0);
  const [col, setCol]           = useState(0);
  const [wordList, setWordList] = useState([])

  function changeColor(target) {
    const color = target.style.backgroundColor

    let newColor;
    if (color === '') {
      newColor = COLORS[0]
    } else {
      newColor = COLORS[(COLORS.indexOf(color) + 1) % COLORS.length]
    }

    target.style.backgroundColor = newColor
    target.style.borderColor = newColor
  }

  function resetColor(box) {
    // box.style.backgroundColor = GREY_HIGHLIGHT
    box.style.backgroundColor = ''
    box.style.borderColor = BLACK
  }

  function rowColored() {
    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`col${row}${i}`)
      const color = box.style.backgroundColor
      if (color === GREY_HIGHLIGHT || color === '') {
        console.log('row not colored')
        return false
      }
    }
    return true
  }

  function markCurrentRow(currRow=row) {
    for (let i = 0; i < 5;  i++) {
      const box = document.getElementById(`col${currRow}${i}`)
      resetColor(box)
    }
  }
  
  function setBoxCharacter(event) {
    event.preventDefault()
    console.log(event.target.id)
  
    if (event.target.id === 'key_ENTER') {
      if (row == 4 || col != 5 || !rowColored()) {
        return
      }
      updateWordList()
      setRow(prevRow => {
        const newRow = prevRow + 1;
        setCol(0);  // Update col
        markCurrentRow(newRow);  // Pass the updated row
        return newRow;  // Return the new row state value
      });

      return
    } 
  
    if (event.target.id === 'key_DEL') {
      if (col == 0) {
        return
      }
      const box = document.getElementById(`col${row}${col - 1}`)
      box.value = ''
      box.blur()
      resetColor(box)
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
      const box = document.getElementById(`col${row}${i}`)
      rowLetters[i] = {
        letter: box.value,
        color: box.style.backgroundColor
      }
    }

    for (let i = 0; i < 5; i++) {
      console.log('iteration: ', i)
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
          }
        } else if (greenExists) {
          for (let j = row; j < 6; j++) {
            for (let k = 0; k < 5; k++) {
              if (greenIndexes.includes(k)) {
                continue
              }
              validLetters[j][k] = validLetters[j][k].replace(currLetter, '')
            }
          }
        } else {
          for (let j = row; j < 6; j++) {
            for (let k = 0; k < 5; k++) {
              validLetters[j][k] = validLetters[j][k].replace(currLetter, '')
            }
          }
        }
      } else if (rowLetters[i].color === GREEN) {
        console.log('found green')
        for (let j = row; j < 6; j++) {
          validLetters[j][i] = currLetter
        }
        console.log('setting green: ', validLetters[row][i])
      } else if (rowLetters[i].color === YELLOW) {
        console.log('found yellow')
        for (let j = row; j < 6; j++) {
          validLetters[j][i] = validLetters[row][i].replace(currLetter, '')
        }
      } else {
        console.log('found neither black, yellow, nor green')
      }
    }
    console.log(validLetters)
    updateFrequencies(rowLetters)
    console.log(letterFrequencies)

    // Filter the word list and save it in wordLists
    filterWordList()
    setWordList(wordLists[row + 1])

    /*
    let newWords = [...Array((row + 1) * 2)]
    for (let i = 0; i < (row + 1) * 2; i++) {
      newWords[i] = dict[i]
    }
    setWordList(newWords)
    */
  }

  function updateFrequencies(rowLetters) {
    console.log('updating frequencies')

    let duplicates = []
    let temp = []

    for (let i = 0; i < 5; i++) {
      const currLetter = rowLetters[i].letter
      if (temp.includes(currLetter) && !duplicates.includes(currLetter)) {
        duplicates.push(currLetter)
      } else {
        temp.push(currLetter)
      }
    }

    let singletons = temp.filter(item => !duplicates.includes(item))

    // Update singleton letters
    for (let i = 0; i < singletons.length; i++) {
      console.log('updating singletons: ', singletons[i])
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
      console.log('updating duplicates: ', duplicates[0])
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

      const currLetter = duplicates[i]
      if (!(currLetter in letterFrequencies)) {
        letterFrequencies[currLetter] = {
          atLeast: nbrColored,
          atMost: 5
        }
      } else {
        letterFrequencies[currLetter].atLeast = Math.max(letterFrequencies[currLetter].atLeast, nbrColored)
      }
      if (nbrBlack > 0) {
        letterFrequencies[currLetter].atMost = letterFrequencies[currLetter].atLeast
      }
    }

    // Update upper bound of existing letters
    for (const currLetter in letterFrequencies) {
      const currAtLeast = letterFrequencies[currLetter].atLeast
      const totalAtLeast = Object
        .values(letterFrequencies)
        .map(item => item.atLeast)
        .reduce((acc, currentValue) => acc + currentValue, 0);
      console.log('totalAtLeast: ', totalAtLeast)
      const newAtMost = 5 - totalAtLeast + currAtLeast
      let validPositions = 0
      for (let i = 0; i < 5; i++) {
        if (validLetters[row][i].includes(currLetter)) {
          validPositions++
        }
      }
      letterFrequencies[currLetter].atMost = Math.min(newAtMost, 
                                                    letterFrequencies[currLetter].atMost, 
                                                    validPositions)
    }
  }

  function filterWordList() {
    let newWords = []
    newWords = wordLists[row].filter(word => {
      for (let i = 0; i < 5; i++) {
        if (!validLetters[row][i].includes(word[i])) {
          return false
        }
      } 
      return true
    });
    newWords = newWords.filter(word => {
      for (const currLetter in letterFrequencies) {
        if (!containsAtLeast(word, currLetter, letterFrequencies[currLetter].atLeast)) {
          return false
        }
        if (!containsAtMost(word, currLetter, letterFrequencies[currLetter].atMost)) {
          return false
        }
      }
      return true
    });
    wordLists[row + 1] = newWords
  }

  function containsAtLeast(word, letter, atLeast) {
    let count = 0
    for (let i = 0; i < 5; i++) {
      if (word[i] === letter) {
        count++
      }
    }
    return count >= atLeast
  }

  function containsAtMost(word, letter, atMost) {
    let count = 0
    for (let i = 0; i < 5; i++) {
      if (word[i] === letter) {
        count++
      }
    }
    return count <= atMost
  }

  useEffect(() => {
    const firstInput = document.getElementById('col00');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  useEffect(() => {
    markCurrentRow()
  }, []);

  useEffect(() => {
    wordLists[0] = dict
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