import { useState, useEffect } from 'react'
import './WordList.css'
import dict from './dict.mjs'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function WordList({ wordList, validLetters, validLetterFrequencies, fillWord, row, screenWidth }) {
    const [suggestedWords, setSuggestedWords] = useState([])
    const hasWords = wordList.length > 0

    function wordHandler(event) {
        fillWord(event.target.innerText)
    }

    useEffect(() => {
        updateScores()
    }, [wordList]);

    function updateScores() {
        let letterFrequencies = getLetterFrequencies()
        console.log('letterFrequencies: ', letterFrequencies)
        let yellowLetterIndexFrequencies = getYellowLetterIndexFrequencies()
        console.log('valid letters in row: ', validLetters[row])
        console.log('yellowLetterIndexFrequencies: ', yellowLetterIndexFrequencies)
        
        let scores = {}
        for (const i in wordList) {
            const currWord = wordList[i]
            let score = 0

            let visitedLetters = []
            for (const i in currWord) {
                const letter = currWord[i]
                if (!visitedLetters.includes(letter)) {
                    score += letterFrequencies[letter]
                    visitedLetters.push(letter)
                } else {
                    score += (letterFrequencies[letter] / 2)
                }
                if (yellowLetterIndexFrequencies[letter]) {
                    score += yellowLetterIndexFrequencies[letter][i] / 5
                }
            }
            scores[currWord] = score
        }

        if (wordList.length > 2 && wordList.length < 20 && Object.keys(validLetterFrequencies).length < 5) {
            // with 20 or less words left, suggest words that cover as many letters as possible 
            // from the letters in the words that are currently neither black, green, or yellow 
            // (+2 points for each letter)

            const multiplier = Object.keys(validLetterFrequencies).length
            const unusedLetters = getUnusedLetters()

            for (const word of dict) {
                if (wordList.includes(word)) {
                    continue
                }

                let visitedLetters = []
                let score = 0
                for (const letter of unusedLetters) {
                    if (word.includes(letter) && !visitedLetters.includes(letter)) {
                        score += 0.45 * multiplier
                        visitedLetters.push(letter)
                    }
                }
                if (score > 2.5) {
                    scores[word] = score
                }
            }
        }
        console.log('sorted scores: ', Object.fromEntries(Object.entries(scores).sort((a, b) => b[1] - a[1])))
        setSuggestedWords(Object.keys(scores).sort((a, b) => scores[b] - scores[a]).slice(0, 8))
    }

    function getLetterFrequencies() {
        let letterFrequencies = {}
        for (const letter of ALPHABET) {
            letterFrequencies[letter] = wordList
                .filter(word => word.includes(letter))
                .length / wordList.length;
        }
        return letterFrequencies
    }

    function getYellowLetterIndexFrequencies() {
        let yellowLetters = []
        for (const currLetter of Object.keys(validLetterFrequencies)) {
            if (yellowLetters.includes(currLetter)) {
                continue
            }

            let foundLetter = false
            let foundGreen = false
            for (let j = 0; j < 5; j++) {
                if (validLetters[row][j].includes(currLetter)) {
                    foundLetter = true
                    if (validLetters[row][j].length === 1) {
                        foundGreen = true
                    }
                }
            }
            if (foundLetter && !foundGreen) {
                yellowLetters.push(currLetter)
            }
        }
        let yellowLetterIndexFrequencies = {}
        for (const letter of yellowLetters) {
            yellowLetterIndexFrequencies[letter] = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0
            }
        } 
        for (const word of wordList) {
            for (const i in word) {
                const letter = word[i]
                if (yellowLetters.includes(letter)) {
                    yellowLetterIndexFrequencies[letter][i]++
                }
            }
        }
        for (const letter of yellowLetters) {
            let currFrequencies = yellowLetterIndexFrequencies[letter]
            const total = Object.values(currFrequencies).reduce((a, b) => a + b)
            for (const i in currFrequencies) {
                currFrequencies[i] /= total
            }
        }
        return yellowLetterIndexFrequencies
    }

    function getUnusedLetters() {
        const usedLetters = Object.keys(validLetterFrequencies)
        let unusedLetters = []
        for (const word of wordList) {
            for (const letter of word) {
                if (!usedLetters.includes(letter) && !unusedLetters.includes(letter)) {
                    unusedLetters.push(letter)
                }
            }
        }
        return unusedLetters
    }

    return (
        <div className='word-list-container'>
            <div className='word-list' style={{ width: `${screenWidth * 0.1}px` }}>
                <h2 className='word-list-header'>Possible words</h2>
                <ul className='list-group'>
                    {!hasWords && <li className='list-group-item default-list-item'>--No suggestions--</li>}
                    {hasWords && wordList.map((word, i) => (
                        <li 
                            className='list-group-item word-item' 
                            key={`word${i}`} 
                            onDoubleClick={wordHandler}>
                            {word}
                        </li>
                    ))}
                </ul>
            </div>

            <div className='word-list' style={{ width: `${screenWidth * 0.1}px` }}>
                <h2 className='word-list-header'>Suggested guesses</h2>
                <ul className='list-group'>
                    {!hasWords && <li className='list-group-item default-list-item'>--No suggestions--</li>}
                    {hasWords && suggestedWords.map((word, i) => (
                        <li 
                            className='list-group-item word-item' 
                            key={`word${i}`} 
                            onDoubleClick={wordHandler}>
                            {word}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default WordList;