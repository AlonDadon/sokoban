'use strict'
const WALL = 'WALL';
const FLOOR = 'FLOOR';
const GAMER = 'SOKOBAN';
const BOX = 'BOX'
const TARGET = 'TARGET'
const GLUE = 'GLUE'
const WATER = 'WATER'
var gBoard;
var gGamerPos;
var gGamerCountSteps;
var gIsMoveToGlue;
var gTimer;
var gSeconds;
var gGameIsOn;
var gLastBoard;

function restGame() {
	gGameIsOn = true;
	gameOverModal(false);
	clearInterval(gTimer)
	gTimer = null
	gTimer = setInterval(updateTime, 1000)
	gGamerCountSteps = 0
	gGameIsOn = true;
	gGamerPos = { i: 5, j: 5 };
	gSeconds = 0
	gLastBoard = getBoard()
	BOX_IMG = '🌷'
	GAMER_IMG = '🐝'
}
function endTimer() {
	clearInterval(gTimer)
	gTimer = null
}
function getGameIsOn() {
	return gGameIsOn
}
function getTimer() {
	return gSeconds
}
function updateTime() {
	gSeconds++
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
function getIsMoveToGlue() {
	return gIsMoveToGlue
}
function updateGameElement(location, value) {
	gBoard[location.i][location.j].gameElement = value;
}
function updateGamerPos(i, j) {
	gGamerPos = { i: i, j: j }
}
function updateGamerCountSteps(diff) {
	gGamerCountSteps += diff
}
function getGamerCountSteps() {
	return gGamerCountSteps
}
function undo() {
	let cellGamer = { gameElement: "SOKOBAN" }
	let lastGamerPos = findGamerPos(gLastBoard, cellGamer.gameElement)
	updateGamerPos(lastGamerPos.i, lastGamerPos.j)
	gBoard = gLastBoard
}
function findGamerPos(board, object) {
	let gamer = JSON.stringify(object)
	let gamerPos = {}
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board.length; j++) {
			if (JSON.stringify(board[i][j].gameElement) === gamer) {
				return gamerPos = { i: i, j: j }
			}
		}
	}
}
function isMoveToGlue(isGlue) {
	gIsMoveToGlue = isGlue
	if (gIsMoveToGlue) updateGamerCountSteps(5)
}
function isVictory() {
	if (isBoxesInTargets()) {
		BOX_IMG = '🍯'
		GAMER_IMG = '<img src="../win.png" />'
		gGameIsOn = false
		clearInterval(gTimer)
		gameOverModal(true);
		playAudio(gWinAudio)
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
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1 ||
				j === 2 && i > 2 && i < 7 || j === 7 && i > 2 && i < 7 || 
				i === 8 && j > 2 && j < 6) {
				cell.type = WALL;
			}
			if (i > 1 && i < 8 && j === 9 || j === 3 && i > 2 && i < 7) {
				cell.type = WATER;
			}
			board[i][j] = cell;
		}
	}
	board[3][4].type = WALL;
	board[6][4].type = WALL;
	board[3][1].type = WALL;
	board[1][7].type = WALL;

	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	board[4][5].gameElement = BOX;
	board[7][4].gameElement = BOX;
	board[2][8].gameElement = BOX;

	board[2][4].type = TARGET;
	board[8][7].type = TARGET;
	board[4][1].type = TARGET;

	board[3][5].gameElement = GLUE;
	board[7][6].gameElement = GLUE;
	return board;
}
function saveLastBoard(board) {
	gLastBoard = board
}