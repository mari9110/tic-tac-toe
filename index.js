const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

const gameField = [[], [], []]
let clickCounter = 0
let end = false

startGame();
addResetListener();


function initGameField(dimension, gameField){
    for (let i = 0; i < dimension; i++) {
        gameField[i] = new Array(dimension)
        for (let j = 0; j < dimension; j++) {
            gameField[i][j] = EMPTY;
        }
    }
    console.log(gameField, 'Field initialized')
}

function startGame () {
    let resize=document.getElementById('inputSize').value;
    initGameField(resize, gameField);
    renderGrid(resize);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function checkWinner(gameField){
    const checkHorizontalWinner = () => {
        for (let i=0;i<gameField.length;i++){
            let rowString = gameField[i].join("")
            if (rowString === CROSS.repeat(gameField.length)){
                alert(`${CROSS} победил`)
                paintWinningFields(rowString, i)
                break
            }
            else if(rowString === ZERO.repeat(gameField.length)) {
                alert(`${ZERO} победил`)
                paintWinningFields(rowString, i)
                break
            }
        }
    }
    const checkVerticalWinner = (index) => {
        let flatArray = gameField.flat(2)
        console.log(flatArray)
        let word = ''
        for (let i = index; i < flatArray.length; i+=gameField.length) {
            if(flatArray[i]===EMPTY)
                continue
            word += flatArray[i]
        }
        if( word===CROSS.repeat(gameField.length)){
            alert(`${CROSS} победил`)
            paintWinningFields(gameField, index, true)
            return true
        }
        else if( word===ZERO.repeat(gameField.length)){
            alert(`${ZERO} победил`)
            paintWinningFields(gameField, index, true)
            return true
        }
    }
    const checkDiagonalWinner = () => {
        let word = ''
        let word2 = ''
        for (let i=0; i<gameField.length; i++){
            word += String(gameField[i][i])
            for (let j=0; j<gameField.length; j++){
                if (i+j === gameField.length-1) word2 += String(gameField[i][j])
            }
            if (word === CROSS.repeat(gameField.length) || word === ZERO.repeat(gameField.length)){
                alert(`${word[0]} победил`)
                paintWinningFields(gameField, 0, false, true)
                return true
            }
            else if (word2 === CROSS.repeat(gameField.length) || word2 === ZERO.repeat(gameField.length)){
                alert(`${word2[0]} победил`)
                paintWinningFields(gameField, gameField.length, false, true)
                return true
            }
        } 
    }
    const paintWinningFields = (line, startIndex, col = false, dia = false) => {
        end = true
        if (dia){
            if (startIndex === 0){
                for (let i = 0; i < gameField.length; i ++) {
                    findCell(i, i).style.color = 'red'
                }
                return
            }
            else{
                for (let i=0; i<gameField.length; i++){
                    for (let j=0; j<gameField.length; j++){
                        if (i+j === gameField.length-1) findCell(i, j).style.color = 'red'
                    }
                }
                return
            }
        }
        if (col){
            for (let i = 0; i < line.length; i++) {
                findCell(i, startIndex).style.color = 'red'
            }
            return
        }
        for (let i = 0; i < line.length; i++) {
            findCell(startIndex, i).style.color = 'red'
        }
    }
    checkHorizontalWinner()
    for(let i=0;i<gameField.length;i++){
        if(checkVerticalWinner(i)){
            break
        }
    }
    checkDiagonalWinner()
}

function random(gameField){
    return Math.floor(Math.random()*gameField.length);
}

function computerMove(gameField){
    let randomC = random(gameField);
    let randomR = random(gameField);
        if (gameField[randomR][randomC] === EMPTY)
        {
            gameField[randomR][randomC] = ZERO;
            console.log(`Clicked on cell: ${randomR}, ${randomC}`);
            clickCounter++;
            renderSymbolInCell(ZERO, randomR, randomC);
            console.log(gameField);
        }
        else{
            computerMove(gameField)
        }
}

function cellClickHandler (row, col) {
    if (gameField[row][col]===EMPTY && !end){
        let fieldState = clickCounter % 2 === 0 ? CROSS : ZERO;
        gameField[row][col] = fieldState;
        console.log(`Clicked on cell: ${row}, ${col}`);
        clickCounter++;
        renderSymbolInCell(fieldState, row, col);
        console.log(gameField);
        computerMove(gameField)
    }
    checkWinner(gameField)
    if (clickCounter === gameField.length**2)
        alert('Победила дружба')
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    startGame();
    clickCounter=0;
    end=false;
}

/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
