import { useState, useEffect, useRef } from 'react'
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

const ENTER_ERROR_MSG = 'All tiles must be filled.'
const SUCCESS_MSG = 'Great job!'

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
  const [showInfo, setShowInfo]         = useState(false)
  const [status, setStatus]             = useState(ENTER_ERROR_MSG)
  const colRef = useRef(col)
  const rowRef = useRef(row)

  function reset() {
    for (let i = Math.min(rowRef.current, 5); i >= 0; i--) {
      for (let j = 0; j < 5; j++) {
        const box = document.getElementById(`col${i}${j}`)
        const letter = document.getElementById(`col${i}${j}letter`)
        letter.textContent = ''
        box.style.backgroundColor = ''
        box.style.borderColor = BLACK
      }
    }
    document.getElementById(`col00`).style.borderColor = GREY_SELECTED
    setWordList([])
    setRow(0)
    setCol(0)
    wordLists = []
    wordLists[0] = dict
    letterFrequencies = {}
    validLetters = initLetters()
  }

  function setColorHandler(event) {
    const span = event.target
    const label = span.parentElement
    const letter = span.textContent
    const currRow = label.id[3]

    if (letter === '' || currRow != row) {
        return
    }

    setColor(label)
}

  function setColor(target) {
    const color = target.style.backgroundColor

    let newColor
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
      const box = document.getElementById(`col${rowRef.current}${i}`)
      const color = box.style.backgroundColor
      if (color === '') {
        return false
      }
    }
    return true
  }

  function rowCorrect() {
    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`col${rowRef.current}${i}`)
      const color = box.style.backgroundColor
      if (color !== GREEN) {
        return false
      }
    }
    return true
  }

  function fillWord(word) {
    if (rowRef.current == 6) {
      return
    }
    
    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`col${rowRef.current}${i}`)
      const letter = document.getElementById(`col${rowRef.current}${i}letter`)
      letter.textContent = word[i]
      box.style.backgroundColor = ''
      box.style.borderColor = GREY_SELECTED
    }
    setCol(5)
  }
  
  function handleKeyPress(event) {
    if (showHelp) 
      return;

    if (!event.key?.includes('F') || event.key?.length === 1) {
      event.preventDefault()
    }

    let id = event.target.id === '' ? event.currentTarget.id : event.target.id

    if (id === 'key_ENTER' || event.key === 'Enter')
      return handleEnterPress();
  
    if (id === 'key_DEL' || event.key === 'Backspace')
      return handleBackspace();
  
    if (colRef.current == 5 || rowRef.current == 6)
      return;

    let box = document.getElementById(`col${rowRef.current}${colRef.current}`)
    let newValue = !id ? event.key.toUpperCase() : id[4]
    if (!ALPHABET.includes(newValue)) {
      return
    }

    const letter = document.getElementById(`col${rowRef.current}${colRef.current}letter`)
    letter.textContent = newValue
    box.style.borderColor = GREY_SELECTED
    box.classList.add('pop-animation')
    setCol(prevCol => prevCol + 1)
  }

  async function handleEnterPress() {
    if (rowRef.current == 6) return

    if (colRef.current != 5 || !rowColored()) {
      displayInfo(ENTER_ERROR_MSG)
      return
    }

    if (rowCorrect()) {
      setRow(6)
      setWordList([])
      displayInfo(SUCCESS_MSG)
      return
    }

    const currentRow = rowRef.current
    setRow(prevRow => prevRow + 1)
    setCol(0)

    const animateBox = async (index) => {
      const box = document.getElementById(`col${currentRow}${index}`)
      box.classList.add('mega-pop-animation')
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    const animation_duration = 1500
    const animationPromise = (async () => {
      for (let i = 0; i < 5; i++) {
        await animateBox(i)
      }
      await new Promise(resolve => setTimeout(resolve, animation_duration))
    })()


    const wordListPromise = new Promise(resolve => {
      updateWordList(currentRow)
      resolve()
    })

    console.log('Waiting for animations to finish...')
    await Promise.all([animationPromise, wordListPromise])
    console.log('Animations finished!')

    if (currentRow < 5) {
      const nextBox = document.getElementById(`col${currentRow + 1}${0}`)
      nextBox.style.borderColor = GREY_SELECTED
    }

    setWordList(wordLists[currentRow + 1])
  }

  function handleBackspace() {
    if (colRef.current == 0) 
      return;

    let box = document.getElementById(`col${rowRef.current}${colRef.current - 1}`)
    const letter = document.getElementById(`col${rowRef.current}${colRef.current - 1}letter`)
    letter.textContent = ''
    box.style.backgroundColor = ''
    setCol(prevCol => prevCol - 1)
    if (colRef.current > 1) {
      box.style.borderColor = BLACK
    } else {
      box.style.borderColor = GREY_SELECTED
    }
  }

  function updateWordList(row) {
    const rowLetters = {}
    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`col${row}${i}`)
      const letter = document.getElementById(`col${row}${i}letter`)
      rowLetters[i] = {
        letter: letter.textContent,
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
    updateFrequencies(row, rowLetters)
    filterWordList(row)
  }

  function updateFrequencies(row, rowLetters) {
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

  function filterWordList(row) {
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

  function displayInfo(msg) {
    setStatus(msg)
    setShowInfo(true)
    setTimeout(() => {
      document.querySelector('.error-box').classList.add('hidden')
      setTimeout(() => {
        setShowInfo(false)
      }, 200);
    }, 1500);
  }

  function displayHelp() {
    setShowHelp(true)
  }

  function closeHelp() {
    document.querySelector('.help-content').classList.add('hidden')
    setTimeout(() => {
      setShowHelp(false)
    }, 150);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    };
  }, [showHelp]);

  useEffect(() => {
    colRef.current = col;
  }, [col]);

  useEffect(() => {
    rowRef.current = row;
  }, [row]);

  useEffect(() => {
    wordLists[0] = dict
    document.getElementById(`col00`).style.borderColor = GREY_SELECTED
  }, []);

  useEffect(() => {
    document.getElementById('root').style.minWidth = '350px'
    const secondRowHeight = `${screenWidth * 0.2 * 1.25}px`
    document.documentElement.style.setProperty('--second-row-height', secondRowHeight)
  }, [screenWidth]);

  useEffect(() => {
    if (showInfo) {
      document.querySelector('.error-box').classList.add('show')
      document.querySelector('.error-box').classList.remove('hidden')
    }
  }, [showInfo]);

  return (
    <>
      <div className='main-container'>

        <div className='top-menu-border'></div>
        <Menu reset={reset} displayHelp={displayHelp} />
        <div className='top-menu-border'></div>

        <div></div>
        <MainGrid setColorHandler={setColorHandler} screenWidth={screenWidth} />
        <WordList 
          wordList={wordList} 
          validLetters={validLetters}
          validLetterFrequencies={letterFrequencies}
          fillWord={fillWord} 
          row={rowRef.current} 
          screenWidth={screenWidth} 
        />

        <div></div>
        <Keyboard handleKeyPress={handleKeyPress} screenWidth={screenWidth} />
        <div></div>

      </div>

      {showHelp && <HelpScreen onClose={closeHelp} screenWidth={screenWidth} />}
      {showInfo && <div className={`error-box ${showInfo ? 'show' : 'hidden'}`}>
        {status}
      </div>}
    </>
  );
}

export default App;