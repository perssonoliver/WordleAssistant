import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const keyboard = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

function MainGrid() {
  return (
    <div className="main-grid">
        {[...Array(6)].map((_, i) => (
        <div className="row grid-row" key={`row${i}`}>
          {[...Array(5)].map((_, j) => (
            <input 
            className="col grid-col"  
              type="text" 
              maxLength="1" 
              key={`col${i}${j}`}
              id={`col${i}${j}`}>
            </input>
          ))}
        </div>
      ))}
      </div>
  );
}

function App() {
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [count, setCount] = useState(0);

  function KeyBoard() {
    return (
      <div>
        <div className='horizontal-list'>
        {keyboard[0].split('').map((_, i) => (
            <li>
              <label
                className='key-label'
                key={`key_${keyboard[0][i]}`} 
                id={`key_${keyboard[0][i]}`} 
                onClick={inputCharacter}>
                {keyboard[0][i]}
              </label>
            </li>
          ))}
        </div>
  
        <div className='horizontal-list'>
          {keyboard[1].split('').map((_, i) => (
            <li>
              <label 
                className='key-label'
                key={`key_${keyboard[1][i]}`} 
                id={`key_${keyboard[1][i]}`} 
                onClick={inputCharacter}>
                {keyboard[1][i]}
              </label>
            </li>
          ))}
        </div>
  
        <div className='horizontal-list'>
            <label 
              className='enter-key-label'
              key={'key_ENTER'} 
              id={'key_ENTER'} 
              onClick={inputCharacter}>
              {'ENTER'}
            </label>
          {keyboard[2].split('').map((_, i) => (
            <li>
              <label 
                className='key-label'
                key={`key_${keyboard[2][i]}`} 
                id={`key_${keyboard[2][i]}`} 
                onClick={inputCharacter}>
                {keyboard[2][i]}
              </label>
            </li>
          ))}
          <label 
            className='del-key-label'
            key={'key_DEL'} 
            id={'key_DEL'} 
            onClick={inputCharacter}>
            {'DEL'}
          </label>
        </div>
      </div>
    );
  }
  
  function inputCharacter(event) {
    event.preventDefault()
    console.log(event.target.id)
  
    if (event.target.id === 'key_ENTER') {
      // todo
      return
    } 
  
    if (event.target.id === 'key_DEL') {
      // todo
      return
    }
  
    const char = event.target.id[4]
    if (col == 5) {
      return
    }
    const input = document.getElementById(`col${row}${col}`)
    input.value = char
    input.blur()
    setCol(col + 1)
  
  
    /* Implement later
    let char = event.key
    event.target.value = char.toUpperCase()
    event.target.blur()
  
    const next = event.target.nextElementSibling
    if (next && next.id[4] != '0') {
      next.focus()
    }
    */
  }

  useEffect(() => {
    const firstInput = document.getElementById('col00');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  return (
    <>
      <MainGrid />
      <KeyBoard />

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App;