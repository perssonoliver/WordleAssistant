import { useState, useEffect } from 'react'
import './App.css'
import dict from './dict.mjs'
import Keyboard from './Keyboard'
import MainGrid from './MainGrid'
import WordList from './WordList'
import Menu from './Menu'
import HelpScreen from './HelpScreen'

const GREY_SELECTED = 'rgb(95, 95, 95)'
const BLACK   = 'rgb(59, 59, 59)'
const YELLOW  = 'rgb(181, 159, 59)'
const GREEN   = 'rgb(83, 141, 78)'
const COLORS  = [BLACK, YELLOW, GREEN]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let wordLists = []
let letterFrequencies = {}
let validLetters = initLetters()

const screenWidth = window.screen.width

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
  const [row, setRow]                   = useState(0)
  const [col, setCol]                   = useState(0)
  const [wordList, setWordList]         = useState([])
  const [showHelp, setShowHelp]         = useState(false)
  const [showError, setShowError]       = useState(false)
  const [currentBox, setCurrentBox]     = useState(null)

  function reset() {
    for (let i = Math.min(row, 5); i >= 0; i--) {
      for (let j = 0; j < 5; j++) {
        const box = document.getElementById(`col${i}${j}`)
        box.value = ''
        box.style.backgroundColor = ''
        box.style.borderColor = BLACK
      }
    }
    setWordList([])
    setRow(0)
    setCol(0)
    wordLists = []
    wordLists[0] = dict
    letterFrequencies = {}
    validLetters = initLetters()
    const box = document.getElementById('col00')
    box.focus()
    setCurrentBox(box)
  }

  function setColor(target) {
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

  function rowColored() {
    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`col${row}${i}`)
      const color = box.style.backgroundColor
      if (color === '') {
        return false
      }
    }
    return true
  }

  function fillWord(word) {
    if (row == 6) {
      return
    }
    
    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`col${row}${i}`)
      box.value = word[i]
      box.style.backgroundColor = ''
      box.style.borderColor = GREY_SELECTED
      box.blur()
    }
    setCol(5)
    const nextBox = document.getElementById(`col${row}4`)
    nextBox.focus()
    setCurrentBox(nextBox)
  }
  
  function handleKeyPress(event) {
    const id = event.target.id === '' ? event.currentTarget.id : event.target.id

    if (!event.key?.includes('F') || event.key?.length === 1) {
      event.preventDefault()
    }
  
    if (id === 'key_ENTER' || event.key === 'Enter')
      return handleEnterPress();
  
    if (id === 'key_DEL' || event.key === 'Backspace')
      return handleBackspace();
  
    if (col == 5 || row == 6)
      return;

    let box;
    let newValue;

    if (id.includes('col')) {
      box = document.getElementById(`col${row}${col}`)
      newValue = event.key.toUpperCase()
      if (!ALPHABET.includes(newValue)) {
        return
      }
    } else {
      box = document.getElementById(`col${row}${col}`)
      newValue = id[4]
    }

    box.value = newValue
    box.style.borderColor = GREY_SELECTED
    if (col < 4) {
      box.blur()
      const nextBox = document.getElementById(`col${row}${col + 1}`)
      nextBox.focus()
      setCurrentBox(nextBox)
    }
    setCol(col + 1)
  }

  function handleEnterPress() {
    if (row == 6)
      return;

    if (col != 5 || !rowColored()) {
      setShowError(true)
      setTimeout(() => {
        document.querySelector('.error-box').classList.add('hidden')
        setTimeout(() => {
          setShowError(false)
        }, 200);
      }, 1500);
      return
    }

    updateWordList()
    if (row < 5) {
      const nextBox = document.getElementById(`col${row + 1}${0}`)
      nextBox.focus()
      setCurrentBox(nextBox)
    }
    setRow(row + 1)
    setCol(0)
  }

  function handleBackspace() {
    if (col == 0) 
      return;

    let box = document.getElementById(`col${row}${col - 1}`)
    box.focus()
    setCurrentBox(box)
    box.value = ''
    box.style.backgroundColor = ''
    box.style.borderColor = BLACK
    if (col > 0) {
      setCol(col - 1)
    }
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
      const currLetter = rowLetters[i].letter
      const currColor = rowLetters[i].color

      switch (currColor) {
        case GREEN:
          // Assign (only) green letter to the column
          for (let j = row; j < 6; j++) {
            validLetters[j][i] = currLetter
          }
          break;
        case YELLOW:
          // Remove yellow letter from the column
          for (let j = row; j < 6; j++) {
            validLetters[j][i] = validLetters[row][i].replace(currLetter, '')
          }
          break;
        case BLACK:
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
            // Only remove black letter from the current column
            for (let j = row; j < 6; j++) {
              validLetters[j][i] = validLetters[j][i].replace(currLetter, '')
            }
          } else if (greenExists) {
            // Remove black letter from all columns except green ones
            for (let j = row; j < 6; j++) {
              for (let k = 0; k < 5; k++) {
                if (greenIndexes.includes(k)) {
                  continue
                }
                validLetters[j][k] = validLetters[j][k].replace(currLetter, '')
              }
            }
          } else {
            // Remove black letter from all columns
            for (let j = row; j < 6; j++) {
              for (let k = 0; k < 5; k++) {
                validLetters[j][k] = validLetters[j][k].replace(currLetter, '')
              }
            }
          }
          break;
      }
    }
    console.log(validLetters)
    updateFrequencies(rowLetters)
    console.log(letterFrequencies)

    filterWordList()
    setWordList(wordLists[row + 1])
  }

  function updateFrequencies(rowLetters) {
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

  function displayHelp() {
    setShowHelp(true)
  }

  function closeHelp() {
    document.querySelector('.help-content').classList.add('hidden')
    setTimeout(() => {
      setShowHelp(false)
    }, 150);
    setCurrentBox(currentBox)
  }

  useEffect(() => {
    const firstInput = document.getElementById('col00');
    if (firstInput) {
      firstInput.focus()
      setCurrentBox(firstInput)
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (currentBox && !event.target.closest('.main-grid')) {
        currentBox.focus()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    };
  }, [currentBox]);

  useEffect(() => {
    wordLists[0] = dict
  }, []);

  return (
    <>
      <Menu reset={reset} displayHelp={displayHelp} />
      <div 
        className='main-container' 
        style={{ 
          minWidth: `${screenWidth * 0.2 + screenWidth * 0.1 + 150}px`, 
          height: `${screenWidth * 0.2 * 1.25}px`
        }}
      >
        <MainGrid row={row} setColor={setColor} screenWidth={screenWidth} handleKeyPress={handleKeyPress} />
        <WordList 
          wordList={wordList} 
          validLetters={validLetters}
          validLetterFrequencies={letterFrequencies}
          fillWord={fillWord} 
          row={row} 
          screenWidth={screenWidth} 
        />
      </div>

      <Keyboard handleKeyPress={handleKeyPress} screenWidth={screenWidth} />

      {showHelp && <HelpScreen onClose={closeHelp} screenWidth={screenWidth} />}
      {showError && <div className={`error-box ${showError ? '' : 'hidden'}`}>
        All tiles must be filled.
      </div>}
    </>
  );
}

export default App;