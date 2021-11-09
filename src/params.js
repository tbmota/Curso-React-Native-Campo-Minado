import { Dimensions } from "react-native"

const params = {
    blockSize: 30,
    borderSize: 5,
    fontSize: 15,
    headerRatio: 0.15, //Proporção do painel superior na tela
    difficultLevel: 0.1, //0.1 ocupa 10% da tela
    getColumnsAmount() { //quantidade de colunas
        const width = Dimensions.get('window').width
        return Math.floor(width / this.blockSize)
    },
    getRowsAmount() {
        const totalHeight = Dimensions.get('window').height
        const boardHeight = totalHeight * (1 - this.headerRatio)
        return Math.floor(boardHeight / this.blockSize)
    }
}

export default params

// window: tamanho da tela sem a barra de menu
// screen: Tamanho total da tela