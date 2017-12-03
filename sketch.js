var angle = 0;
var radius = 30;
var width = 1;
var height = 1;
var tick = 1000;
var last = 0;
var current = 0;

var columns = 10;

var blockRegistry = [];

var Block = function(color) {
	this.color = color;
}

var phys = function(blockRegistry) {
	for (var x = 0; x < blockRegistry.length; x++) {
		var col = blockRegistry[x]
		for (var y = blockRegistry.length-1; y >= 0; y--) {
			var block = col[y];
			if (block != null && y != 4) {
				if (blockRegistry[x][y+1] == null) {
					var buff = blockRegistry[x][y];
					blockRegistry[x][y] = null;
					blockRegistry[x][y+1] = buff
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
	green: {r: 0, g: 255, b: 0}
}
var colorMap = ["red", "blue", "green"];

function initField(blockRegistry) {
	for(var x = 0; x < columns; x++) {
		var col = [];
		for(var y = 0; y < 5; y++) {
			col.push(new Block(colors[colorMap[getRandomInt(0, 3)]]));
		}
		blockRegistry.push(col);
	}
}

function setup() {
	width = 800;
	height = 400;
	size = width/columns;

	createCanvas(width, height);

	initField(blockRegistry);
	
}

var removeBlocks = function(col, row) {
	blockRegistry[col][row] = null;
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

	removeBlocks(col, row);
}

function draw() {
	current += millis() - last;
	last = millis();

	fill(255);
	stroke(0);
	rect(0, 0, width-1, height-1);


	for (var x in blockRegistry) {
		var col = blockRegistry[x]
		for (var y in blockRegistry) {
			var block = col[y];

			if (block != null) {	
				stroke(0);
				
				fill(block.color.r, block.color.g, block.color.b);
				rect(x*size, y*size, size, size);
			}
		}
	}

	if(current > tick) {
		current = 0;
		phys(blockRegistry);
	}

}
