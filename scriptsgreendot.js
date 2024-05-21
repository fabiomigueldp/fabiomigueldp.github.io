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
let distortions = []; // Array para armazenar as distorções
let maxDistortions; // Limite de distorções
const maxDistortionSpeed = 0.5; // Velocidade máxima das distorções

let superPontos = []; // Array para armazenar os super pontos
const maxSuperSpeed = 4.15;
const superGeometryInterval = 5000; // Intervalo de 5 segundos para exibir a super geometria

function setup() {
    createCanvas(windowWidth, windowHeight);
    calculateMaxDistortions();
    let nPontos = (width * height) / (50 * 50);
    for (let i = 0; i < nPontos; i++) {
        pontos.push(createPoint());
    }
    grid = createGrid();

    // Adiciona a função de distorção synthwave a cada 3 segundos
    setInterval(createSynthwaveDistortion, 3000);

    // Adiciona a função de super geometria a cada 5 segundos
    setInterval(createSuperGeometry, superGeometryInterval);

    // Cria alguns super pontos
    createSuperPontos();
}

function calculateMaxDistortions() {
    const baseWidth = 1920;
    const baseHeight = 1080;
    const baseDistortions = 120;
    let proportion = (width * height) / (baseWidth * baseHeight);
    maxDistortions = baseDistortions * proportion;
}

function createPoint() {
    return {
        x: random(width),
        y: random(height),
        vx: random(-maxSpeed, maxSpeed),
        vy: random(-maxSpeed, maxSpeed)
    };
}

function createSuperPontos() {
    let nSuperPontos = 1; // Define o número de super pontos
    for (let i = 0; i < nSuperPontos; i++) {
        superPontos.push({
            x: random(width),
            y: random(height),
            vx: random(-maxSuperSpeed, maxSuperSpeed),
            vy: random(-maxSuperSpeed, maxSuperSpeed)
        });
    }
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
    updateSuperPontos(); // Atualiza os super pontos
    updateGrid();
    drawTriangles();
    updateDistortions(); // Atualiza as posições das distorções
    drawDistortions(); // Desenha as distorções synthwave
    drawSuperPontos(); // Desenha os super pontos
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

function updateSuperPontos() {
    for (let sp of superPontos) {
        sp.x += sp.vx;
        sp.y += sp.vy;

        if (sp.x < edgeBuffer || sp.x > width - edgeBuffer) {
            sp.vx = random(-maxSuperSpeed, maxSuperSpeed);
            sp.x = constrain(sp.x, 0, width);
            sp.y = constrain(sp.y, 0, height);
        }

        if (sp.y < edgeBuffer || sp.y > height - edgeBuffer) {
            sp.vy = random(-maxSuperSpeed, maxSuperSpeed);
            sp.x = constrain(sp.x, 0, width);
            sp.y = constrain(sp.y, 0, height);
        }

        sp.x = constrain(sp.x, 0, width);
        sp.y = constrain(sp.y, 0, height);
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

function drawDistortions() {
    for (let d of distortions) {
        fill(d.color);
        noStroke();
        ellipse(d.x, d.y, d.size, d.size);
    }
}

function createSynthwaveDistortion() {
    let numDistortions = random(1, 1); // Número aleatório de distorções a serem criadas
    for (let i = 0; i < numDistortions; i++) {
        if (distortions.length >= maxDistortions) break; // Limite de distorções
        distortions.push({
            x: random(width),
            y: random(height),
            size: random(5, 50),
            color: color(random(200, 255), random(100, 255), random(100, 255), 150),
            vx: random(-maxDistortionSpeed, maxDistortionSpeed), // Velocidade x
            vy: random(-maxDistortionSpeed, maxDistortionSpeed)  // Velocidade y
        });
    }
    setTimeout(() => {
        distortions.splice(100, numDistortions);
    }, 1000);
}

function updateDistortions() {
    for (let d of distortions) {
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;

        d.x = constrain(d.x, 0, width);
        d.y = constrain(d.y, 0, height);
    }
}

function drawSuperPontos() {
    for (let sp of superPontos) {
        fill(0, 255, 0);
        noStroke();
        ellipse(sp.x, sp.y, 10, 10);
    }
}

function createSuperGeometry() {
    let numSuperPontos = floor(random(1, superPontos.length));
    for (let i = 0; i < numSuperPontos; i++) {
        let sp = superPontos[floor(random(superPontos.length))];
        drawSuperGeometria(sp);
    }
}

function drawSuperGeometria(sp) {
    fill(0, 255, 0, 150);
    noStroke();
    let size = 50;
    let angle = random(TWO_PI);
    beginShape();
    for (let a = 0; a < TWO_PI; a += PI / 6) {
        let sx = sp.x + cosh(a) * size;
        let sy = sp.y + sinh(a) * size;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    grid = createGrid(); // Recria a grade quando o tamanho da janela muda
    calculateMaxDistortions(); // Recalcula o limite de distorções com base no novo tamanho da janela
}
