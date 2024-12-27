import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  // STATE ------------------------------------------------------------
  
  const variableRefs = useRef({})
  const commandRef = useRef(null)
  const [commandInput, setCommandInput] = useState('')
  const [focusedVariable, setFocusedVariable] = useState('')
  const [selectedVariables, setSelectedVariables] = useState([])

  // derived from state
  const tokens = commandInput.split(/\s+/)
  const N = tokens.length

  const fillerVariables = {
    age1: 30,
    age2: 30,
    age3: 30,
    age4: 30,
    age5: 30,
    age6: 30,
    age7: 30,
    age8: 30,
    age9: 30,
    age10: 30,
    age11: 30,
    age12: 30,
    age13: 30,
    age14: 30,
    age14: 30,
    age15: 30,
    age16: 30,
    age17: 30,
    age18: 30,
    age19: 30,
    age20: 30,
    age21: 30,
    age22: 30,
    age23: 30,
    age24: 30,
    age25: 30,
    age26: 30,
    age27: 30,
    age28: 30,
    age29: 30,
    age30: 30,
    age31: 30,
    age32: 30,
    age33: 30,
    age34: 30,
    age35: 30,
    age36: 30,
    age37: 30,
    age38: 30,
    age39: 30,
    age40: 30,
    age41: 30,
    age42: 30,
    age43: 30,
    age44: 30,
    age45: 30,
    age46: 30,
    age47: 30,
    age48: 30,
    age49: 30,
    age50: 30,
    age51: 30,
    age52: 30,
    age53: 30,
    age54: 30,
    age55: 30,
    age56: 30,
  }

  const testData = [ 
    {'name': 'adam', 'age': 32, ...fillerVariables},
    {'name': 'bryan', 'age': 40, ...fillerVariables},
    {'name': 'jim', 'age': 43, ...fillerVariables}
  ]

  // dont search if on going command
  const bypassFilter = commandInput.substring(0, 2) == 'g ' ||
    commandInput.substring(0, 2) == 's ' ||
    commandInput.length == 1 
  
  // data that will be shown to user
  const dataView = bypassFilter ?
    testData :
    testData.filter(x => {
    const combinedText = Object.values(x)
      .join(' ')
      .toLowerCase()
    return combinedText.includes(commandInput.toLowerCase())
  })
  const allVariables = Object.keys(testData[1])
  const shownVariables = selectedVariables.length === 0 ?
    allVariables :
    selectedVariables

  // STYLE ------------------------------------------------------------
  
  const tableStyle = {
    paddingBottom: '2rem',
    borderSpacing: '1rem 0rem',
    marginLeft: '-1rem'
  }
  
  const tableCellStyle = {
    'padding': '0.0rem 0.0rem'
  }

  const headerColour = '#1ca400'
  const focusedColour = '#1caaff'
  const focusedTableCellHeadStyle = {
    'fontWeight': 'normal', 
    'color': focusedColour,
    borderBottom: `0.15rem solid ${focusedColour}`
  }
  const tableCellHeadStyle = {
    'fontWeight': 'normal', 
    'color': headerColour,
    borderBottom: `0.15rem solid ${headerColour}`
  }

  const inputStyle = {
    background: 'none',
    border: 'none',
    outline: 'none'
  }

  const searchBarContainerStyle = {
    display: 'flex', alignItems: 'center', background: 'rgb(64, 255, 37)', padding: '0.2rem'
  }

  // COMPONENTS ------------------------------------------------------------
  const Cell = ({text}) => <td style = {tableCellStyle}> {text} </td>
    const HeadCell = ({text}) => <th style = {text == focusedVariable ? focusedTableCellHeadStyle: tableCellHeadStyle} 
    tabIndex={0}
    ref={el => variableRefs.current[text] = el}
    onClick = {() => focusVariable(text)}> {text} </th>
  const Row = ({record}) => (
      <tr>
      {
        shownVariables.map(cellKey => 
          <Cell key={cellKey} text={record[cellKey]}/>)
      }
    </tr>)

  const unfinishedVariable = tokens.at(-1)
  const suggestedVariables = allVariables
              .filter(x => unfinishedVariable.length > 1 &&
                x.includes(unfinishedVariable))
  const Suggestions = () =>
        <p>
          {
            suggestedVariables
              .map(x => <span>{x}&nbsp;&nbsp;&nbsp;</span>)
          }
        </p>

  // HANDLERS ------------------------------------------------------------
  const submitCommand = () => {
    // goto 
    if (N === 2 && tokens[0] === 'g') {
      const gotoVariable = tokens[1]
      if (gotoVariable === '.first') {
        focusVariable(shownVariables[0])
      }
      if (gotoVariable === '.last') {
        focusVariable(shownVariables.at(-1))
      }
      else {
        focusVariable(tokens[1])
      }
      setCommandInput('')
    }

    // clear
    else if (N === 1 && tokens[0] === 'c') {
      setCommandInput('')
    }

    // select
    else if (N >= 2 && tokens[0] === 's') {
      const commandVariables = tokens.slice(1)
      if (commandVariables.includes('*')) {
        setSelectedVariables(allVariables)
      }
      else {
        setSelectedVariables(commandVariables)
      }
      setCommandInput('')
    }

    // select-and 
    else if (tokens[0] === 'sa' && N >= 2) {
      const commandVariables = tokens.slice(1)
      if (commandVariables.includes('*')) {
        setSelectedVariables(allVariables)
      }
      else {
        const newSelection = shownVariables.concat(commandVariables)
        setSelectedVariables(newSelection)
      }
      setCommandInput('')
    }

  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitCommand()
    }
    // auto complete
    else if (e.key === 'Tab') {
      e.preventDefault()

      // replace unfinished variable with suggestion
      const newCommand = tokens.slice(0, -1)
        .concat(suggestedVariables[0])
        .join(' ')
      setCommandInput(newCommand + ' ')
    }
  }

  const handleSearchChange = (e) => {
    setCommandInput(e.target.value)
  }

  const focusVariable = (variableName) => {
    variableRefs.current[variableName].focus()
    setFocusedVariable(variableName)
    commandRef.current.focus()
  }

  return (
    <>
      <div className = 'appContainer'>
        <Suggestions />
        <span style = {searchBarContainerStyle}>
          <span>&gt;</span>
          <input 
            style={inputStyle}
            placeholder="search"
            value={commandInput} 
            ref={commandRef}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            autoFocus/>
        </span>
        <p>{dataView.length}/{testData.length} matches</p>
        <div className='overflow'>
          <table style = {tableStyle}>
            <thead>
              <tr>
                {
                  shownVariables
                    .map(variableName => <HeadCell text={variableName}/>)
                }
              </tr>
            </thead>
            <tbody>
              { dataView.map(record => <Row record = {record} />) }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
