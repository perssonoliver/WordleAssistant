import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Keyboard from './Keyboard'
import MainGrid from './MainGrid'
import WordList from './WordList'

function App() {
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  
  function setBoxCharacter(event) {
    event.preventDefault()
    console.log(event.target.id)
  
    if (event.target.id === 'key_ENTER') {
      updateWordList()
      if (row == 5 || col != 5) {
        return
      }

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

  useEffect(() => {
    const firstInput = document.getElementById('col00');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  return (
    <>
      <div className='container'>
        <MainGrid/>
        <WordList/>
      </div>

      <Keyboard setBoxCharacter={setBoxCharacter}/>
    </>
  )
}

export default App;