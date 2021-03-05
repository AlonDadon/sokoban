'use strict'
var gWinAudio = document.getElementById("win-audio");
var gGlueAudio = document.getElementById("glue-audio");
var gGwaterAudio = document.getElementById("water-audio");
var gTargetAudio = document.getElementById("target-audio");

const WALL_IMG = '<img src="image/WALL.png" />'
var GAMER_IMG = '🐝'
var BOX_IMG = '🌷'
const TARGET_IMG = '🧇'
const GLUE_IMG = '🕸'
const WATER_IMG = '🥓'
var gRenderTimerInterval;

function init() {
    restGame()
    gRenderTimerInterval = clearInterval
    gRenderTimerInterval = setInterval(renderTimer, 1000)
    let board = getNewBoard()
    renderBoard(board);
    renderSteps()
}
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j })
            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';
            strHTML += '\t<td class="cell ' + cellClass +
                '"  onclick="moveTo(' + i + ',' + j + ')" >\n';
            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BOX) {
                strHTML += BOX_IMG;
            } else if (currCell.type === TARGET) {
                strHTML += TARGET_IMG;
            }
            else if (currCell.gameElement === GLUE) {
                strHTML += GLUE_IMG;
            }
            else if (currCell.type === WATER) {
                strHTML += WATER_IMG;
            }
            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHTML;
}
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}
function onHandleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;
    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;
    }
}
function moveTo(i, j) {
    console.log('POS', gGamerPos)
    var lastBoard = JSON.stringify(gBoard)
    saveLastBoard(JSON.parse(lastBoard))
    let gameIsOn = getGameIsOn()
    if (!gameIsOn) return
    let board = getBoard()

    let IsMoveToGlue = getIsMoveToGlue()
    if (IsMoveToGlue) return
    let targetCell = board[i][j];
    if (targetCell.type === WALL) return;
    let gamerPos = getGamerPos()
    let iDiff = (i - gamerPos.i);
    let jDiff = (j - gamerPos.j);
    let boxLocation = { i: i + iDiff, j: j + jDiff }
    let iAbsDiff = Math.abs(i - gamerPos.i);
    let jAbsDiff = Math.abs(j - gamerPos.j);
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
        if (targetCell.gameElement === GLUE) {
            playAudio(gGlueAudio)
            isMoveToGlue(true)
            setTimeout(isMoveToGlue, 5000, false)
        }
        if (targetCell.gameElement === BOX) {
            if (board[boxLocation.i][boxLocation.j].type === WALL) return;
            if (board[boxLocation.i][boxLocation.j].gameElement !== null) return;
            updateGameElement(boxLocation, BOX)
            if (board[boxLocation.i][boxLocation.j].type === TARGET) {
                playAudio(gTargetAudio)
                isVictory()
                console.log('is target')
            }
            if (board[gamerPos.i + iDiff][gamerPos.j].type !== WATER) {
                if (board[boxLocation.i][boxLocation.j].type === WATER) {
                    slidesDown(board, boxLocation.i, boxLocation.j, BOX)
                    playAudio(gGwaterAudio)
                    board = getBoard()
                    gamerPos = getGamerPos()
                }
            }
        }
        updateGameElement(gamerPos, null)
        updateGamerPos(i, j)
        gamerPos = getGamerPos()
        updateGameElement(gamerPos, GAMER)
        updateGamerCountSteps(1)
        renderSteps()
        console.log('AFTER', gBoard)
        renderBoard(board)
        console.log('AFTER', gGamerPos)
    }
}
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}
function renderSteps() {
    let gamerCountSteps = getGamerCountSteps()
    let elSteps = document.querySelector('.steps')
    elSteps.innerText = gamerCountSteps
}
function onUndo() {
    let gameIsOn = getGameIsOn()
    if (!gameIsOn) return
    if (gBoard === gLastBoard) {
        alert('You can go back a step only once after a step forward.')
        return;
    }
    undo()
    renderBoard(gBoard)
    renderSteps()
}
function renderTimer() {
    let timer = getTimer()
    let elTimer = document.querySelector('.timer');
    elTimer.innerText = padNum(timer);
}
function gameOverModal(isVictory) {
    let add = (isVictory) ? '.h-header' : '.victory-modal'
    let remove = (isVictory) ? '.victory-modal' : '.h-header'
    document.querySelector(remove).classList.remove('hidden')
    document.querySelector(add).classList.add('hidden')
}
function playAudio(audioName){
let audioNames =[gTargetAudio,gGwaterAudio,gGlueAudio,gWinAudio]
let  play = audioNames.find(function(play){
return play === audioName
})
play.play()
}

// to the next update
// fix-not found url
// var audio = new Audio("sound/water.wav");

