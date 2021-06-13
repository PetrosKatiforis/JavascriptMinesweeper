import {
    CELL_STATES,
    createBoard,
    markCell,
    revealCell,
    checkWinner
} from "./minesweeper.js"

// Storing the initial game state
const gameOptions = {
    boardSize: {
        x: 18,
        y: 12
    },
    numberOfMines: 30
}

const board = createBoard(
    gameOptions.boardSize.x, 
    gameOptions.boardSize.y,
    gameOptions.numberOfMines
)

const boardElement = document.querySelector("#board")

// Passing the width and height variables to the css file as a custom property
boardElement.style.setProperty("--width", gameOptions.boardSize.x)
boardElement.style.setProperty("--height", gameOptions.boardSize.y)

// Rendering the board
board.forEach(row => {
    row.forEach(cell => {
        boardElement.appendChild(cell.element)
        
        cell.element.addEventListener("click", () => {
            new Audio("audio/select.wav").play()
            
            revealCell(cell, board)
            checkWinner(board)
        })
        
        
        // Right click event
        cell.element.addEventListener("contextmenu", event => {
            // Prevent the options menu from showing up
            event.preventDefault()
            
            markCell(cell)
        })
        
    })
})

