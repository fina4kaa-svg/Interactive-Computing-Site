let ballRadius = 220;
let tiles = [];
let angle = 0;
let rotSpeed = 0.01;

// Flow field background
let bgParticles = [];
let bgCount = 1200;
let off = 0.0025;
let zOff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  smooth();
  buildTiles();
  for (let i = 0; i < bgCount; i++) {
    bgParticles.push(new BgParticle(true));
  }
}

function buildTiles() {
  let numRows = 26;
  for (let row = 0; row <= numRows; row++) {
    let phi = map(row, 0, numRows, 0.08, PI - 0.08);
    let r = sin(phi) * ballRadius;
    let cols = max(3, round((TWO_PI * r) / 15));
    for (let col = 0; col < cols; col++) {
      tiles.push({
        phi: phi,
        baseTheta: map(col, 0, cols, 0, TWO_PI),
        seed: random(10000),
        hue: random([320, 330, 340, 350, 355, 310, 300])
      });
    }
  }
}

class BgParticle {
  constructor(randomAge) {
    this.reset(randomAge);
  }

  reset(randomAge) {
    this.x  = random(width);
    this.y  = random(height);
    this.px = this.x;
    this.py = this.y;
    this.maxLife = random(100, 120);
    this.life    = randomAge ? random(this.maxLife) : this.maxLife;
    // Deep blue → indigo → violet range
    this.hue = random(200, 270);
    this.sat = random(70, 100);
  }

  update() {
    this.px = this.x;
    this.py = this.y;

    // Flow field angle: blend Perlin noise with tangential spin around canvas center
    let noiseAngle    = noise(this.x * off, this.y * off, zOff) * TWO_PI * 2;
    let tangential    = atan2(this.y - height / 2, this.x - width / 2) + HALF_PI;
    let flowAngle     = lerp(noiseAngle, tangential, 0.55);

    this.x += cos(flowAngle) * 5;
    this.y += sin(flowAngle) * 5;
    this.life--;
  }

  show() {
    let alpha = map(this.life, 0, this.maxLife, 0, 0.55);
    stroke(this.hue, this.sat, 85, alpha);
    strokeWeight(2);
    line(this.px, this.py, this.x, this.y);
  }

  isDead() {
    return this.life < 0 ||
           this.x < 0 || this.x > width ||
           this.y < 0 || this.y > height;
  }
}

function draw() {
  // Semi-transparent fade instead of full clear — creates trail persistence
  noStroke();
  fill(0, 0, 0, 0.18);
  rect(0, 0, width, height);

  // Draw background flow field
  for (let i = bgParticles.length - 1; i >= 0; i--) {
    bgParticles[i].update();
    bgParticles[i].show();
    if (bgParticles[i].isDead()) bgParticles[i] = new BgParticle(false);
  }
  zOff += 0.004; // slowly evolve the field over time

  angle += rotSpeed;

  // String from top-center to ball
  stroke(0, 0, 50, 0.7);
  strokeWeight(2);
  line(width / 2, 0, width / 2, height / 2 - ballRadius);

  push();
  translate(width / 2, height / 2);

  // Opaque sphere base cuts cleanly through the flow field trails
  noStroke();
  fill(0, 0, 5);
  circle(0, 0, ballRadius * 2.02);

  // Project tiles to 2D, cull back hemisphere
  let visible = [];
  for (let t of tiles) {
    let theta = t.baseTheta + angle;
    let x = ballRadius * sin(t.phi) * cos(theta);
    let y = ballRadius * cos(t.phi);
    let z = ballRadius * sin(t.phi) * sin(theta);
    if (z > -15) visible.push({ x, y, z, t });
  }

  visible.sort((a, b) => a.z - b.z);

  for (let { x, y, z, t } of visible) {
    let n = noise(t.seed, frameCount * 0.05);
    let sparkle = pow(n, 2.5) * 100;

    let sz    = map(z, -ballRadius, ballRadius, 3, 14);
    let base  = map(z, -ballRadius, ballRadius, 5, 30);
    let bright = min(base + sparkle * 0.65, 100);

    let h = t.hue, s;
    if (sparkle > 85) {
      s = map(sparkle, 85, 100, 40, 0);
    } else if (sparkle > 50) {
      s = map(sparkle, 50, 85, 30, 100);
    } else {
      s = map(sparkle, 0, 50, 10, 30);
    }

    noStroke();
    fill(h, s, bright);
    circle(x, y, sz);

    if (sparkle > 72) {
      let alpha = map(sparkle, 72, 100, 0, 0.95);
      let len   = sz * map(sparkle, 72, 100, 1, 5.5);
      let starS = sparkle > 85 ? map(sparkle, 85, 100, 40, 0) : s * 0.3;
      stroke(h, starS, 100, alpha);
      strokeWeight(0.5);
      line(x - len, y, x + len, y);
      line(x, y - len, x, y + len);
      line(x - len * 0.55, y - len * 0.55, x + len * 0.55, y + len * 0.55);
      line(x - len * 0.55, y + len * 0.55, x + len * 0.55, y - len * 0.55);
    }
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
