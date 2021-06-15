export const CELL_STATES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked"
}

class Cell {
    constructor(positionX, positionY, isMine) {
        this.element = document.createElement("div")
        this.state = CELL_STATES.HIDDEN
        
        this.x = positionX
        this.y = positionY
        this.isMine = isMine
    }
    
    set state(newState) {
        this.element.dataset.state = newState
    }
    
    get state() {
        return this.element.dataset.state
    }
}

export function createBoard(width, height, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(width, height, numberOfMines)
    
    for (let y = 0; y < height; y++) {
        // Creating the row
        const row = []
        
        // Looping through each column
        for (let x = 0; x < width; x++) {
            const isMine = minePositions.some(p => positionMatch(p, { x, y }))
            const cell = new Cell(x, y, isMine)
            
            row.push(cell)
        }
        
        board.push(row)
    }
    
    return board
}

function getMinePositions(width, height, numberOfMines) {
    const positions = []
    
    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumberInRange(width),
            y: randomNumberInRange(height)
        }
        
        if (!positions.some(p => positionMatch(p, position))) {
            positions.push(position)
        }
    }
    
    return positions
}

function randomNumberInRange(max) {
    return Math.floor(Math.random() * max)
}

function positionMatch(a, b) {
    return a.x == b.x && a.y == b.y
}

export function markCell(cell) {
    // If the cell is already marked, hide it again
    if (cell.state == CELL_STATES.MARKED) {
        cell.state = CELL_STATES.HIDDEN
        
    } else if (cell.state == CELL_STATES.HIDDEN) {
    
        // Else, if it's not revealed, mark it
        cell.state = CELL_STATES.MARKED
    }
}

export function revealCell(cell, board) {
    // If the cell is not hidden, return
    if (cell.state !== CELL_STATES.HIDDEN) {
        return
    }
    
    if (cell.isMine) {
        // If it's a mine, play the audio and exit
        cell.state = CELL_STATES.MINE
        new Audio("audio/explosion.wav").play()
            
        return
    }
    
    // Otherwise, reveal it and count the nearby mines
    cell.state = CELL_STATES.NUMBER
    const nearbyCells = getNearbyCells(cell, board)
    const mines = nearbyCells.filter(cell => cell.isMine)
    
    // If it has no mines, reveal the neighbours too
    if (mines.length === 0) {
        
        // Setting a delay of 20ms for the animation effect
        setTimeout(() => {
            nearbyCells.forEach(cell => {
                revealCell(cell, board)
            })
        }, 20)
        
    } else {
        // Otherwise, display the mine count
        cell.element.innerText = mines.length
    }
}

function getNearbyCells(cell, board) {
    let nearbyCells = []
    
    // Looping through the offsets for each exis
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
        for (let offsetY = -1; offsetY <= 1; offsetY++) {
            
            // ?. will prevent an index error and it will return "undefined" if it's not found
            const nearbyCell = board[cell.y + offsetY]?.[cell.x + offsetX]
            
            // If the cell exists, push it to the list
            if (nearbyCell) {
                nearbyCells.push(nearbyCell)
            }
        } 
    }
    
    return nearbyCells
}

function showModalAndRefresh(message) {
    alert(message)
    window.location.reload()
}

export function checkWinner(board) {
    // Lose = A mine that has been revealed
    const hasLost = board.some(row => (
        row.some(cell => (
            cell.isMine && cell.state === CELL_STATES.MINE
        ))
    ))
    
    // Victory = All cells revealed and the mines are either marked or hidden
    const hasWon = board.every(row => (
        row.every(cell => (
            cell.state === CELL_STATES.NUMBER ||
            (cell.isMine && (cell.state === CELL_STATES.HIDDEN || 
            cell.state === CELL_STATES.MARKED))
        ))
    ))
    
    if (hasWon || hasLost) {
        // The game is over, reveal all the mines        
        board.forEach(row => row.forEach(cell => {
            if (cell.isMine) {
                cell.state = CELL_STATES.MINE
            }
        }))
        
        // Show the modal and refresh
        showModalAndRefresh(hasWon ? "Congratulations! You won!" : "You lost...")
    }
}
