const createBoard = (rows, columns) => {
    return Array(rows).fill(0).map((_, row) => {
        return Array(columns).fill(0).map((_, column) => {
            return {
                row,
                column,
                opened: false,
                flagged: false,
                mined: false,
                exploded: false,
                nearMines: 0
            }
        })
    })
}

const spreadMines = (board, minesAmount) => {
    const rows = board.length
    const columns = board[0].length
    let minesPlanted = 0

    while (minesPlanted < minesAmount) {
        const rowSel = parseInt(Math.random() * rows, 10)
        const columnSel = parseInt(Math.random() * columns, 10)

        if (!board[rowSel][columnSel].mined) {
            board[rowSel][columnSel].mined = true
            minesPlanted++
        }
    }
}

const createMinedBoard = (rows, columns, minesAmount) => {
    const board = createBoard(rows, columns)
    spreadMines(board, minesAmount)
    return board
}


//função responsável por clonar o tabuleiro
const cloneBoard = board => {
    return board.map(rows => {
        return rows.map(field => {
            return { ...field }
        })
    })
}

//função que pega os vizinhos
const getNeighbors = (board, row, column) => {
    const neighbors = []
    const rows = [row - 1, row, row + 1]
    const columns = [column - 1, column, column + 1]
    rows.forEach(r => {
        columns.forEach(c => {
            const different = r !== row || c !== column
            const validRow = r >= 0 && r < board.length
            const validColumn = c >= 0 && c < board[0].length
            if (different && validRow && validColumn) {
                neighbors.push(board[r] [c])
            }
        })
    })
    return neighbors
}

//usando o reduce pra determinar s uma determinada vizinhança é segura ou não
const safeNeighborhood = (board, row, column) => {
    const safes = (result, neighbor) => result && !neighbor.mined //se um estiver minado, a lógica vai dar false e safes = false
    return getNeighbors(board, row, column).reduce(safes, true)
}

//função responsável por abrir o campo ao der um clique
const openField = (board, row, column) => {
    const field = board[row][column]
    if (!field.opened) {
        field.opened = true
        if (field.mined) {
            field.exploded = true
        } else if (safeNeighborhood(board, row, column)) {
            getNeighbors(board, row, column)
                .forEach(n => openField(board, n.row, n.column))
        } else {
            const neighbors = getNeighbors(board, row, column) //usado para abrir o campo de forma recursiva
            field.nearMines = neighbors.filter(n => n.mined).length
        }
    }
}

const fields = board => [].concat(...board)  //pego todos os fields como se fosse um grande array
const hadExplosion = board => fields(board) //saber se o campo está explodido
    .filter(field => field.exploded).length > 0
const pendding = field => (field.mined && !field.flagged)
    || (!field.mined && !field.opened)
const wonGame = board => fields(board).filter(pendding).length === 0
const showMines = board => fields(board).filter(field => field.mined)
    .forEach(field => field.opened = true)

const invertFlag = (board, row, column) => {
    const field = board[row] [column]
    field.flagged = !field.flagged
}

//quantas flags foram marcadas (usadas) no jogo
const flagsUsed = board => fields(board)
    .filter(field => field.flagged).length

//saber se o usuário ganhou ou não, sem campo pendente
export { 
    createMinedBoard,
    cloneBoard,
    openField,
    hadExplosion,
    wonGame,
    showMines,
    invertFlag,
    flagsUsed 
}

// O operador Spread é um recurso que permite acessar o conteúdo de um objeto iterável. Objeto iterável é um objeto, ou estrutura de dados, que permite acessar seu conteúdo com for … of loop. O exemplo mais popular de um iterável é um array. Outro exemplo de iterável pode ser objetos literais ou strings .
// Quando você queria acessar todo o conteúdo em algum iterável, antes que o operador de propagação existisse, você tinha que usar algum tipo de loop, como o for...ofloop mencionado , ou método, como forEach () . Outra opção eram os índices. O Spread Operator permite que você faça isso muito mais rápido e com muito menos código. Sobre a sintaxe.
// A sintaxe do operador spread é simples e fácil de lembrar. Consiste em três pontos ( ...). Esses três pontos são seguidos pelo iterável ( ...someIterable), cujo conteúdo você deseja acessar.

// A função reduce do JavaScript serve para iterar sobre um array e utilizar o valor de cada item para criar um objeto final com base em alguma regra. Como o próprio nome da função sugere, ela “reduz” os itens de um vetor a um valor único. Por exemplo, podemos utilizá-la para obter a soma ou produto dos itens de um vetor numérico.