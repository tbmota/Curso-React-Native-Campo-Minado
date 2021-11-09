import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert} from 'react-native'
import params from './src/params'
// import Flag from './src/components/Flag'
import MineField from './src/components/MineField'
import Header from './src/components/Header'
import LevelSelection from './src/screens/LevelSelection'
import { 
  createMinedBoard,
  cloneBoard,
  openField,
  wonGame,
  showMines,
  hadExplosion,
  invertFlag,
  flagsUsed
} from './src/functions'

export default class App extends Component {

  constructor (props) {
    super(props)
    this.state = this.createState()
  }

  //função responsável por calcular a quantidade de minas dentro de um tabuleiro
  minesAmount = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return Math.ceil(cols * rows * params.difficultLevel)
  }

  //função responsável por criar o estado desse componente
  createState = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false,
    }
  }

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    const won = wonGame(board)

    if (lost){
      showMines(board)
      Alert.alert('Sorry!', 'Você perdeu!!')
    }

    if (won){
      Alert.alert('Parabéns!', 'Você ganhou!!')
    }

    this.setState( {board, lost, won} )
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if (won) {
      Alert.alert('Parabéns!', 'Você ganhou!!')
    }

    this.setState({ board, won })
  }

  onLevelSelected = level => {
    params.difficultLevel = level
    this.setState(this.createState())
  }

  render() {
    return (
      <View style={styles.container}>
        <LevelSelection isVisible={this.state.showLevelSelection}
          onLevelSelected={this.onLevelSelected}
          onCancel={() => this.setState({ showLevelSelection: false })} />
        <Header flagsLeft={this.minesAmount() - flagsUsed(this.state.board)}
          onNewGame={() => this.setState(this.createState())} 
          onFlagPress={() => this.setState({ showLevelSelection: true })} />
        <View style={styles.board}>
          <MineField board={this.state.board} 
            onOpenField={this.onOpenField} 
            onSelectField={this.onSelectField} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
});

//map a função define como o array será transformado

//         <Field />
//         <Field opened />
//         <Field opened nearMines={1} />
//         <Field opened nearMines={2} />
//         <Field opened nearMines={3} />
//         <Field opened nearMines={6} />
//         <Field mined />
//         <Field mined opened />
//         <Field mined opened exploded />
//         <Field flagged />
//         <Field flagged opened />