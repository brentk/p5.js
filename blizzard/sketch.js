let canvas = null;
let width = window.innerWidth;
let height = window.innerHeight;
let backgroundColor = 126;
let flakeCount = 30;
let flakes = [];
let tick = 0;

function windowResized() {
    width = window.innerWidth;
    height = window.innerHeight;
    resizeCanvas(width, height);
}

function rand(low, high) {
    return Math.random() * (high - low) + low;
}

function updateBackgroundColor() {
    backgroundColor += rand(-1, 1);
    if (backgroundColor > 200) {
        backgroundColor = 200;
    }
    if (backgroundColor < 100) {
        backgroundColor = 100;
    }
    background(backgroundColor);
}

function invertSize(x) {
    if (x == 1) return 5;
    if (x == 2) return 4;
    if (x == 3) return 3;
    if (x == 4) return 2;
    if (x == 5) return 1;
    return x;
}

function randomizeFlake(flake) {
    flake.z = rand(1, 5),
    flake.x = width,
    flake.y = 0,
    flake.staticY = height/2,
    flake.waveHeight = rand(7, 15),
    flake.waveFrequency = rand(80, 120),
    flake.speed = invertSize(flake.z) * 8,
    flake.color = invertSize(flake.z) * 50;
    flake.size = invertSize(flake.z) * 4;
    flake.waveOffset = rand(0, 1000);
    return flake;
}

function setup() {
    canvas = createCanvas(width, height);
    canvas.parent("canvas-parent");

    for (let i = 0; i < flakeCount; i++) {
        flakes.push(randomizeFlake({}));
    }

    //prime the animation so everything doesn't start at once
    for(let i = 0; i < 500; i++) {
        for(let j = 0; j < flakes.length; j++) {
            updateFlake(flakes[j]);
        }
    }
}

function renderFlake(flake) {
    fill(flake.color)
    stroke(flake.color)
    rect(flake.x, flake.y, flake.size, flake.size)
}

// Update a flake's position
function updateFlake(flake) {

    //Make the overall direction of the flakes drift over time
    let windDirection = Math.floor(sin(tick/200) * 5);
    flake.staticY -= windDirection;

    //Move the flake along and make it travel in a horizontal wave
    flake.x -= flake.speed;
    flake.y = flake.staticY + sin((flake.x + flake.waveOffset)/flake.waveFrequency) * flake.waveHeight;
    if (flake.x < 1) {
        flake.x = width;
        flake.staticY = rand(0, height);
    }
}

// Sort the flakes so smaller, farther away ones don't render over larger, closer ones
function sortFlakes (flake1, flake2) {
    if (flake1.z < flake2.z) { return -1; }
    if (flake1.z > flake2.z) { return  1; }
    return 0;
}

function draw() {
    updateBackgroundColor();

   flakes.map(value => updateFlake(value));
   flakes.sort(sortFlakes)
   flakes.map(value => renderFlake(value));

   tick++;
}
