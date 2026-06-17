
let seeds = [];
let seedW = 21, seedH = 30;
let cols = 12, rows = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initSeeds();
}

function initSeeds() {
  seeds = [];
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height * 0.3, height * 0.7);
    if (random() > 0.2) {
      seeds.push(new Seed(x, y));
    }
  }
}

function mousePressed() {
  initSeeds();
}

function draw() {
  let ctx = drawingContext;
  let grad = ctx.createLinearGradient(0, 0, 0, height);
  [['#71E069', 0], ['#FFF', 0.1], ['#FF2121', 0.5], ['#FFF', 0.9], ['#71E069', 1]]
    .forEach(c => grad.addColorStop(c[1], c[0]));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  for (let s of seeds) {
    s.show();
  }

  fill(30);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(25);
  text('click and move your mouse', width / 2, height / 4);
}

class Seed {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.maxDist = 200; // 마우스 반응 거리
  }

  show() {
    // 1. 거리 계산 (this.x, this.y 사용)
    let d = dist(mouseX, mouseY, this.x, this.y);
    
    let scl = 1;
    let angle = 0;

    // 2. 마우스가 가까우면(maxDist 보다 작으면) 변화 계산
    if (d < this.maxDist) {
      // 가까울수록 크기는 1 -> 2.5배로
      scl = map(d, 0, this.maxDist, 2.5, 1, true);
      // 가까울수록 회전은 많이 (TWO_PI * 2 = 720도)
      angle = map(d, 0, this.maxDist, TWO_PI * 2, 0, true); 
    }

    push();
    translate(this.x, this.y);
    rotate(angle);
    scale(scl);
    noStroke();
    fill('#230E0E');
    ellipse(0, 0, seedW, seedH);
    pop();
  }
}