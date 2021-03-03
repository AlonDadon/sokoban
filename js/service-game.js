'use strict'
var gBoard;
var gGamerPos;
var gGamerCountSteps;
var gLastGamerPos;
var gIsMoveToGlue;
var gTimer;
var gSeconds;
var gGameIsOn;
const WALL = 'WALL';
const FLOOR = 'FLOOR';
const GAMER = 'SOKOBAN';
const BOX = 'BOX'
const TARGET = 'TARGET'
const GLUE = 'GLUE'
const WATER = 'WATER'

function restGame() {
	gGameIsOn = true;
	gameOverModal(false);
	endTimer()
	startTimer()
	restGamerLastPos()
	getStartGamerCountSteps()
	getStartGamerPos()
	gameIsOn()
	BOX_IMG = '🌷'
	GAMER_IMG = '🐝'
}
function gameIsOn() {
	gGameIsOn = true;
}

function getGameIsOn() {
	return gGameIsOn
}
function getTimer() {
	return gSeconds
}
function startTimer() {
	gTimer = setInterval(updateTime, 1000)
	gSeconds = 0
}
function updateTime() {
	gSeconds++
}
function endTimer() {
	clearInterval(gTimer)
	gTimer = null
}
function getStartGamerPos() {
	gGamerPos = { i: 5, j: 5 };
}
function getStartGamerCountSteps() {
	gGamerCountSteps = 0
}
function restGamerLastPos() {
	gLastGamerPos = { i: 5, j: 5 };
}
function getNewBoard() {
	return gBoard = buildBoard();
}
function getBoard() {
	return gBoard;
}
function getGamerPos() {
	return gGamerPos
}
function getLastGamerPos() {
	return gLastGamerPos
}
function getIsMoveToGlue() {
	return gIsMoveToGlue
}
function updateGameElement(location, value) {
	gBoard[location.i][location.j].gameElement = value;
}
function updateGamerPos(i, j) {
	if (gGamerPos.i !== i && gGamerPos.j === j ||
		gGamerPos.i === i && gGamerPos.j !== j) {
		saveLastGamerPos(gGamerPos)
	}
	gGamerPos = { i: i, j: j }
}
function updateGamerCountSteps(diff) {
	gGamerCountSteps += diff
}
function getGamerCountSteps() {
	return gGamerCountSteps
}
function undo() {
	updateGameElement(gGamerPos, null)
	updateGameElement(gLastGamerPos, GAMER)
	updateGamerPos(gLastGamerPos.i, gLastGamerPos.j)
	gGamerCountSteps--
}
function saveLastGamerPos(gamerPos) {
	gLastGamerPos = gamerPos
}
function isMoveToGlue(isGlue) {
	gIsMoveToGlue = (isGlue) ? true : false
	if (gIsMoveToGlue) updateGamerCountSteps(5)
}
function isVictory() {
	if (isBoxesInTargets()) {
		// alert('you win')
		BOX_IMG = '🍯'
		GAMER_IMG = '<img src="image/win.png" />'
		gGameIsOn = false
		clearInterval(gTimer)
		gameOverModal(true);
		playWinAudio()
	}
}
function isBoxesInTargets() {
	var boxOutsideTarget = 0
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			if (gBoard[i][j].type === TARGET && gBoard[i][j].gameElement !== BOX) {
				boxOutsideTarget++
			}
		}
	}
	return (!boxOutsideTarget)
}

function slidesDown(mat, cellI, cellJ, value) {
	var nextLoction = { i: cellI, j: cellJ }
	for (var i = cellI; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue;
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (i === cellI && j === cellJ) continue;
			if (j < 0 || j >= mat[i].length) continue;
			if (mat[i][j].type === WATER) {
				updateGameElement(gGamerPos, null)
				updateGameElement(nextLoction, null)
				nextLoction = { i: i, j: j }
				gGamerPos = { i: i - 1, j: j }
				updateGameElement(gGamerPos, GAMER)
				updateGameElement(nextLoction, value)
				setTimeout(slidesDown, 400, gBoard, nextLoction.i, nextLoction.j, value)
			}
		}
	}
	renderBoard(gBoard)
	return nextLoction
}
function padNum(num) {
	if (num < 10) return '00' + num;
	if (num < 100) return '0' + num;
	return '' + num;
}

function buildBoard() {
	var board = createMat(10, 12)
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: FLOOR, gameElement: null };
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	board[6][4].type = WALL;
	board[3][4].type = WALL;
	board[3][2].type = WALL;
	board[3][1].type = WALL;
	board[4][2].type = WALL;
	board[5][2].type = WALL;
	board[6][2].type = WALL;

	board[6][7].type = WALL;
	board[3][7].type = WALL;
	board[4][7].type = WALL;
	board[5][7].type = WALL;
	board[1][7].type = WALL;

	board[8][5].type = WALL;
	board[8][4].type = WALL;
	board[8][3].type = WALL;

	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	board[4][5].gameElement = BOX;
	board[7][4].gameElement = BOX;
	board[2][8].gameElement = BOX;

	board[2][4].type = TARGET;
	board[8][7].type = TARGET;
	board[4][1].type = TARGET;

	board[3][5].gameElement = GLUE;
	board[7][6].gameElement = GLUE;

	board[2][9].type = WATER;
	board[3][9].type = WATER;
	board[4][9].type = WATER;
	board[5][9].type = WATER;
	board[6][9].type = WATER;
	board[7][9].type = WATER;
	board[2][9].type = WATER;
	board[3][3].type = WATER;
	board[4][3].type = WATER;
	board[5][3].type = WATER;
	board[6][3].type = WATER;
	return board;
}
