var angle = 0;
var radius = 30;
var width = 1;
var height = 1;
var tick = 200;
var last = 0;
var current = 0;

var columns = 10;

var mouseEnabled = true;

var blockRegistry = [];

var Block = function(color) {
	this.color = color;
}

var phys = function(blockRegistry) {
	var flip = true;
	while (flip) {
		flip = false;
		for (var x = 0; x < blockRegistry.length; x++) {
			var col = blockRegistry[x]
			for (var y = blockRegistry.length-1; y >= 0; y--) {
				var block = col[y];
				if (block != null && y != 4) {
					if (blockRegistry[x][y+1] == null) {
						var buff = blockRegistry[x][y];
						delete blockRegistry[x][y];
						blockRegistry[x][y] = null;
						blockRegistry[x][y+1] = buff
						flip = true;
					}
				}
			}
		}
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var colors = {
	red: {r: 255, g: 0, b: 0},
	blue: {r: 0, g: 0, b: 255},
	green: {r: 0, g: 255, b: 0},
	yellow: {r: 255, g: 255, b: 0},
	purple: {r: 255, g: 0, b: 255},

}
var colorMap = ["red", "blue", "green", "yellow", "purple"];

function initField(blockRegistry) {
	for(var x = 0; x < columns; x++) {
		var col = [];
		for(var y = 0; y < 5; y++) {
			col.push(null);
			//col.push(new Block("green"));
		}
		blockRegistry.push(col);
	}
}


function loadField(blockRegistry) {
	for (var x in blockRegistry) {
		for (var y in blockRegistry[x]) {
			if (blockRegistry[x][y] == null) {
				blockRegistry[x][y] = new Block(colorMap[getRandomInt(0, 5)]);
			}
		}
	}
}

var removeBlocks = function(col, row) {
	var matches = false;
	var block = blockRegistry[col][row];
	blockRegistry[col][row] = null;

	//left
	if (col > 0 && blockRegistry[col-1][row] != null && blockRegistry[col-1][row].color == block.color) {
		matches = true;
		removeBlocks(col-1, row);
	}
	
	//right
	if (col < columns - 1 && blockRegistry[col+1][row] != null && blockRegistry[col+1][row].color == block.color) {
		matches = true;
		removeBlocks(col+1, row);
	}
	
	//top
	if (row > 0 && blockRegistry[col][row-1] != null && blockRegistry[col][row-1].color == block.color) {
		matches = true;
		removeBlocks(col, row-1);
	}
	
	//bottom
	if (row > 0 && blockRegistry[col][row+1] != null && blockRegistry[col][row+1].color == block.color) {
		matches = true;
		removeBlocks(col, row+1);
	}

	delete block;

}

function mouseClicked() {
	if (mouseX > width || mouseX < 0) {
		return;
	}
	if (mouseY > height || mouseY < 0) {
		return;
	}

	var col = (mouseX - (mouseX % size)) / size;
	var row = (mouseY - (mouseY % size)) / size;

	if (blockRegistry[col][row] != null) {
		removeBlocks(col, row);
		mouseEnabled = false;
		current = 0;
	}
}

function setup() {
	width = 800;
	height = 400;
	size = width/columns;

	createCanvas(width, height);
	initField(blockRegistry);
	loadField(blockRegistry);
}

function draw() {
	current += millis() - last;
	last = millis();

	fill(255);
	stroke(0);
	rect(0, 0, width-1, height-1);


	for (var x in blockRegistry) {
		var col = blockRegistry[x]
		for (var y in blockRegistry[x]) {
			var block = col[y];

			if (block != null) {	
				stroke(0);
				
				fill(colors[block.color].r, colors[block.color].g, colors[block.color].b);
				rect(x*size, y*size, size, size);
			}
		}
	}

	if(current > tick) {
		current = 0;
		phys(blockRegistry);
		loadField(blockRegistry);
		mouseEnabled = true;
	}
}
