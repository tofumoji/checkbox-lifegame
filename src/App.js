import React, { Component } from 'react';
import Lifegame from './Lifegame'
import Header from './Header'
import { initialSize, initialBorderColor, interval } from './constants'

class App extends Component {
  constructor(props) {
    super(props)

    let field = this.initField(initialSize)

    this.state = {
      size: initialSize,
      field,
      started: false,
      interval,
      borderColor: initialBorderColor
    }
  }

  initField(size) {
    let field = new Array(size)
    for (let irow = 0; irow < size; irow++) {
      field[irow] = new Array(size)
      for (let icol = 0; icol < size; icol++) {
        field[irow][icol] = {
          checked: false,
          irow,
          icol,
        }
      }
    }

    return field
  }

  copyField() {
    const { size, field } = this.state

    let copiedField = new Array(size)
    for (let ir = 0; ir < size; ir++) {
      copiedField[ir] = new Array(size)
      for (let ic = 0; ic < size; ic++) {
        copiedField[ir][ic] = {
          ...field[ir][ic]
        }
      }
    }

    return copiedField
  }

  handleLarger() {
    const nextSize = this.state.size + 1
    this.setState({
      size: nextSize,
      field: this.initField(nextSize)
    })
  }

  handleSmaller() {
    const nextSize = this.state.size - 1
    this.setState({
      size: nextSize,
      field: this.initField(nextSize)
    })
  }

  handleCheck(irow, icol) {
    const { field } = this.state

    let nextField = this.copyField()
    nextField[irow][icol] = {
      ...field[irow][icol],
      checked: !field[irow][icol]
    }

    this.setState({
      field: this.state.field.map(row => {
        return row.map(item => {
          return {
            ...item,
            checked: (item.irow === irow && item.icol === icol) ? !item.checked : item.checked
          }
        })
      })
    })
  }

  updateField() {
    const { size, field } = this.state
    let nextField = this.copyField()

    for (let irow = 0; irow < size; irow++) {
      for (let icol = 0; icol < size; icol++) {
        const iup = (irow === 0) ? size - 1 : irow - 1
        const idown = (irow === size - 1) ? 0 : irow + 1
        const ileft = (icol === 0) ? size - 1 : icol - 1
        const iright = (icol === size - 1) ? 0 : icol + 1

        let numNeighbors = 0
        for (let irow_ of [iup, irow, idown]) {
          for (let icol_ of [ileft, icol, iright]) {
            if (irow_ === irow && icol_ === icol) continue
            numNeighbors += (field[irow_][icol_].checked) ? 1 : 0
          }
        }

        if (field[irow][icol].checked) {
          if (numNeighbors <= 1 || numNeighbors >= 4) nextField[irow][icol].checked = false
        } else {
          if (numNeighbors === 3) nextField[irow][icol].checked = true
        }
      }
    }

    let nextBorderColor = '#'
    const letters = '0123456789ABCDEF'
    for (let i = 0; i < 6; i++) nextBorderColor += letters[Math.floor(Math.random() * 16)]

    this.setState({
      field: nextField,
      borderColor: nextBorderColor
    })
  }

  handleStart() {
    this.setState({
      started: true
    })
    this.timer = setInterval(() => {
      this.updateField()
    }, this.state.interval)
  }

  handleStop() {
    this.setState({
      started: false
    })
    clearInterval(this.timer)
  }

  handleRandom() {
    const { size } = this.state
    let nextField = this.copyField()

    for (let irow = 0; irow < size; irow++) {
      for (let icol = 0; icol < size; icol++) {
        nextField[irow][icol].checked = (Math.random() > 0.7) ? true : false
      }
    }

    this.setState({
      field: nextField
    })
  }

  handleAllClear() {
    const { size } = this.state
    let nextField = this.copyField()

    for (let irow = 0; irow < size; irow++) {
      for (let icol = 0; icol < size; icol++) {
        nextField[irow][icol].checked = false
      }
    }

    this.setState({
      field: nextField
    })
  }

  render() {

    return (
      <div>
        <Header />
        <Lifegame 
          size={this.state.size} 
          field={this.state.field} 
          started={this.state.started} 
          borderColor={this.state.borderColor} 
          handleCheck={this.handleCheck.bind(this)} 
          handleStart={this.handleStart.bind(this)} 
          handleStop={this.handleStop.bind(this)} 
          handleRandom={this.handleRandom.bind(this)} 
          handleAllClear={this.handleAllClear.bind(this)} 
          handleLarger={this.handleLarger.bind(this)} 
          handleSmaller={this.handleSmaller.bind(this)} 
        />
      </div>
    )
  }
}

export default App
