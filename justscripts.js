let pontos = [];
const maxSpeed = 0.07;
const edgeBuffer = 20;
const maxDistance = 77;
const maxDistSquared = maxDistance * maxDistance;
const minDistance = 25;
const minDistSquared = minDistance * minDistance;
const extendedMaxDistSquared = 0.716 * maxDistSquared;
let grid, gridCellSize = maxDistance;

let triangles = {}; // Objeto para armazenar os triângulos

function setup() {
    createCanvas(windowWidth, windowHeight);
    let nPontos = (width * height) / (50 * 50);
    for (let i = 0; i < nPontos; i++) {
        pontos.push(createPoint());
    }
    grid = createGrid();
}

function createPoint() {
    return {
        x: random(width),
        y: random(height),
        vx: random(-maxSpeed, maxSpeed),
        vy: random(-maxSpeed, maxSpeed)
    };
}

function createGrid() {
    let cols = ceil(width / gridCellSize);
    let rows = ceil(height / gridCellSize);
    let grid = Array(cols).fill().map(() => Array(rows).fill().map(() => []));

    for (let p of pontos) {
        let col = floor(p.x / gridCellSize);
        let row = floor(p.y / gridCellSize);
        grid[col][row].push(p);
    }
    return grid;
}

function updateGrid() {
    for (let col of grid) {
        for (let cell of col) {
            cell.length = 0;
        }
    }
    for (let p of pontos) {
        let col = floor(p.x / gridCellSize);
        let row = floor(p.y / gridCellSize);
        grid[col][row].push(p);
    }
}

function draw() {
    drawGradientBackground();

    updatePoints();
    updateGrid();
    drawTriangles();
}

function drawGradientBackground() {
    let c1 = color(255, 41, 117);
    let c2 = color(242, 34, 255);
    let c3 = color(140, 30, 255);

    for (let y = 0; y < height; y++) {
        let inter1 = map(y, 0, height, 0, 1);
        let inter2 = map(y, 0, height, 0, 1);
        let c = lerpColor(lerpColor(c1, c2, inter1), c3, inter2);
        stroke(c);
        line(0, y, width, y);
    }
}

function updatePoints() {
    for (let p of pontos) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < edgeBuffer || p.x > width - edgeBuffer) p.vx *= -1;
        if (p.y < edgeBuffer || p.y > height - edgeBuffer) p.vy *= -1;

        p.x = constrain(p.x, 0, width);
        p.y = constrain(p.y, 0, height);
    }
}

function getColor() {
    return color(255, 211, 25);
}

function drawTriangles() {
    let newTriangles = {};

    for (let col of grid) {
        for (let cell of col) {
            for (let i = 0; i < cell.length; i++) {
                for (let j = i + 1; j < cell.length; j++) {
                    let dx = cell[i].x - cell[j].x;
                    let dy = cell[i].y - cell[j].y;
                    let distSq1 = dx * dx + dy * dy;
                    if (distSq1 < maxDistSquared && distSq1 > minDistSquared) {
                        for (let k = j + 1; k < cell.length; k++) {
                            let dx1 = cell[j].x - cell[k].x;
                            let dy1 = cell[j].y - cell[k].y;
                            let distSq2 = dx1 * dx1 + dy1 * dy1;

                            let dx2 = cell[k].x - cell[i].x;
                            let dy2 = cell[k].y - cell[i].y;
                            let distSq3 = dx2 * dx2 + dy2 * dy2;

                            if (distSq2 < maxDistSquared && distSq2 > minDistSquared &&
                                distSq3 < maxDistSquared && distSq3 > minDistSquared) {
                                
                                let id = [cell[i], cell[j], cell[k]].map(p => `${p.x},${p.y}`).sort().join('-');
                                
                                if (triangles[id]) {
                                    newTriangles[id] = triangles[id];
                                } else {
                                    newTriangles[id] = { points: [cell[i], cell[j], cell[k]], life: true };
                                }

                                if (distSq1 < extendedMaxDistSquared && distSq2 < extendedMaxDistSquared && distSq3 < extendedMaxDistSquared) {
                                    newTriangles[id].life = true;
                                } else {
                                    newTriangles[id].life = false;
                                }
                                
                                if (newTriangles[id].life) {
                                    fill(getColor());
                                    triangle(cell[i].x, cell[i].y, cell[j].x, cell[j].y, cell[k].x, cell[k].y);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    triangles = newTriangles;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    grid = createGrid(); // Recria a grade quando o tamanho da janela muda
}
