import { useState, useEffect } from 'react'
import './WordList.css'
import dict from './dict.mjs'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function WordList({ wordList, validLetters, validLetterFrequencies, fillWord, row, screenWidth }) {
    const [suggestedWords, setSuggestedWords] = useState([])
    const hasWords = wordList == null || wordList.length > 0

    function wordHandler(event) {
        fillWord(event.target.innerText)
    }

    useEffect(() => {
        updateScores()
    }, [wordList]);

    function updateScores() {
        if (!wordList) return
        
        let letterFrequencies = getLetterFrequencies()
        let yellowLetterIndexFrequencies = getYellowLetterIndexFrequencies()
        
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
                    score += 0.15
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
        setSuggestedWords(Object.keys(scores).sort((a, b) => scores[b] - scores[a]).slice(0, 10))
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

    function BigScreenWordList({ title, wordList }) {
        return (
            <div className='word-list' style={{ width: screenWidth < 500 ? '50%' : `${screenWidth * 0.1}px` }}>
                <h2 className='word-list-header'>{title}</h2>
                <ul className='list-group'>
                    {!hasWords && 
                        <li className='list-group-item default-list-item'>
                            <option disabled>--No suggestions--</option>
                        </li>
                    }
                    {hasWords && wordList.map((word, i) => (
                        <li 
                            className='list-group-item word-item' 
                            key={`word${i}`} 
                            onDoubleClick={wordHandler}
                        >{word}</li>
                    ))}
                </ul>
            </div>
        );
    }

    function SmallScreenWordList({ title, wordList, nbr }) {
        return (
            <>
                <div className='word-list' style={{ 
                    width: screenWidth < 500 ? '50%' : `${screenWidth * 0.1}px`
                }}>
                    <h2 className='word-list-header'>{title}</h2>
                    <ul className='list-group'>
                        {!hasWords && 
                            <li className='list-group-item default-list-item' style={{ fontSize: '14px' }}>
                                <option disabled>--No suggestions--</option>
                            </li>
                        }
                        {hasWords &&
                            <div className='list-with-modal'>
                                <li 
                                    className='list-group-item default-list-item' 
                                    style={{ 
                                        fontSize: '14px',
                                        borderTopLeftRadius: '6px',
                                        borderTopRightRadius: '6px',
                                        borderBottomLeftRadius: '6px',
                                        borderBottomRightRadius: '6px'
                                    }}
                                    onClick={() => {
                                        document.getElementById(`listModal${nbr}`).style.display = "flex"
                                    }}
                                >Show words</li>
                                <div 
                                    id={`listModal${nbr}`}
                                    className="modal"
                                    onClick={() => document.getElementById(`listModal${nbr}`).style.display = "none"}
                                >
                                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                                        {wordList.map((word, i) => (
                                            <li 
                                                className='list-group-item word-item' 
                                                key={`word${i}`} 
                                                onClick={(event) => (
                                                    wordHandler(event), 
                                                    document.getElementById(`listModal${nbr}`).style.display = "none"
                                                )}
                                            >{word}</li>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                        }
                    </ul>
                </div>
            </>
        )
    }

    return (
        <div className='word-list-container' style={{ minWidth: `${screenWidth * 0.14}px` }}>
            {screenWidth >= 500 && wordList && <BigScreenWordList title='Possible words' wordList={wordList} />}
            {screenWidth >= 500 && wordList && <BigScreenWordList title='Suggested guesses' wordList={suggestedWords} />}

            {screenWidth < 500 && wordList && <SmallScreenWordList title='Possible words' wordList={wordList} nbr={1} />}
            {screenWidth < 500 && wordList && <SmallScreenWordList title='Suggested guesses' wordList={suggestedWords} nbr={2} />}
        </div>
    );
}

export default WordList;