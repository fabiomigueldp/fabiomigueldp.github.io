let pontos = [];
const maxSpeed = 0.444;
const edgeBuffer = 20;
const maxDistance = 150;
const maxDistSquared = maxDistance * maxDistance;
let grid, gridCellSize = maxDistance;

function setup() {
    createCanvas(windowWidth, windowHeight);
    let nPontos = (width * height) / (120 * 120);
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
    background(185, 200, 255);

    updatePoints();
    updateGrid();
    drawTriangles();
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

function drawTriangles() {
    stroke(0);
    strokeWeight(1);
    for (let col of grid) {
        for (let cell of col) {
            for (let i = 0; i < cell.length; i++) {
                for (let j = i + 1; j < cell.length; j++) {
                    let dx = cell[i].x - cell[j].x;
                    let dy = cell[i].y - cell[j].y;
                    if (dx * dx + dy * dy < maxDistSquared) {
                        for (let k = j + 1; k < cell.length; k++) {
                            let dx1 = cell[j].x - cell[k].x;
                            let dy1 = cell[j].y - cell[k].y;
                            let dx2 = cell[k].x - cell[i].x;
                            let dy2 = cell[k].y - cell[i].y;
                            if (dx1 * dx1 + dy1 * dy1 < maxDistSquared && dx2 * dx2 + dy2 * dy2 < maxDistSquared) {
                                triangle(cell[i].x, cell[i].y, cell[j].x, cell[j].y, cell[k].x, cell[k].y);
                            }
                        }
                    }
                }
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    grid = createGrid(); // Recria a grade quando o tamanho da janela muda
}

fetch('https://api.github.com/users/fabiomigueldp')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Aqui você manipularia os dados e atualizaria o DOM conforme necessário
  })
  .catch(error => console.error(error));
