let ballRadius = 220;
let tiles = [];
let angle = 0;

// Spin easing:
// - hover: t ramps 0→1, speed = maxRotSpeed * easeOutExpo(t)  (fast launch, eases to top speed)
// - leave: speed decays multiplicatively each frame            (flywheel coast to a stop)
let t = 0;
let currentSpeed = 0;
const maxRotSpeed = 0.03;
const coastDecay = 0.97; // speed multiplied by this each frame when not hovering

// Flow field background
let bgParticles = [];
let bgCount = 1200;
let off = 0.0025;
let zOff = 0;

// Particle behavior blend: 0 = follow mouse, 1 = flow field
// Eases between states when mouse enters/leaves the ball
let particleBlend = 1;

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// Interpolate between two angles along the shortest arc
function lerpAngle(a, b, amt) {
  let diff = ((b - a + PI) % TWO_PI) - PI;
  return a + diff * amt;
}

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
        hue: 0  // hue is irrelevant at near-zero saturation (silver/white)
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
    this.hue = random(200, 270);
    this.sat = random(70, 100);
  }

  update(dt) {
    this.px = this.x;
    this.py = this.y;

    let noiseAngle  = noise(this.x * off, this.y * off, zOff) * TWO_PI * 2;
    let tangential  = atan2(this.y - height / 2, this.x - width / 2) + HALF_PI;
    let flowAngle   = lerp(noiseAngle, tangential, 0.55);

    // Angle pointing toward the mouse
    let mouseAngle  = atan2(mouseY - this.y, mouseX - this.x);

    // Blend: particleBlend=1 → flow field, particleBlend=0 → follow mouse
    let finalAngle  = lerpAngle(mouseAngle, flowAngle, particleBlend);

    // Ease particle speed: slow crawl when on ball, normal when off
    let spd = lerp(1.2, 0.01, 1 - particleBlend);
    this.x += cos(finalAngle) * spd * dt;
    this.y += sin(finalAngle) * spd * dt;
    this.life -= dt;
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
  // dt normalizes all frame-based values to 60fps so the sketch
  // runs at the same speed regardless of actual frame rate
  let dt = deltaTime / 16.667;

  noStroke();
  fill(0, 0, 0, 0.18);
  rect(0, 0, width, height);

  for (let i = bgParticles.length - 1; i >= 0; i--) {
    bgParticles[i].update(dt);
    bgParticles[i].show();
    if (bgParticles[i].isDead()) bgParticles[i] = new BgParticle(false);
  }
  zOff += 0.004 * dt;

  // Mouse hover detection — is cursor inside the ball?
  let cx = width / 2, cy = height / 2;
  let onBall = dist(mouseX, mouseY, cx, cy) < ballRadius;

  if (onBall) {
    t = min(t + 0.025 * dt, 1);
    currentSpeed = maxRotSpeed * easeOutExpo(t);
    particleBlend = lerp(particleBlend, 1, 0.03 * dt);
  } else {
    t = 0;
    // coastDecay per frame → equivalent per-dt decay
    currentSpeed *= Math.pow(coastDecay, dt);
    particleBlend = lerp(particleBlend, 0, 0.03 * dt);
  }

  angle += currentSpeed * dt;

  // String from top-center to ball
  stroke(0, 0, 50, 0.7);
  strokeWeight(2);
  line(width / 2, 0, width / 2, height / 2 - ballRadius);

  push();
  translate(width / 2, height / 2);

  noStroke();
  fill(0, 0, 5);
  circle(0, 0, ballRadius * 2.02);

  let visible = [];
  for (let tile of tiles) {
    let theta = tile.baseTheta + angle;
    let x = ballRadius * sin(tile.phi) * cos(theta);
    let y = ballRadius * cos(tile.phi);
    let z = ballRadius * sin(tile.phi) * sin(theta);
    if (z > -15) visible.push({ x, y, z, t: tile });
  }

  visible.sort((a, b) => a.z - b.z);

  for (let { x, y, z, t: tile } of visible) {
    let n = noise(tile.seed, frameCount * 0.05);
    let sparkle = pow(n, 2.5) * 100;

    let sz    = map(z, -ballRadius, ballRadius, 3, 14);
    let base  = map(z, -ballRadius, ballRadius, 5, 30);
    let bright = min(base + sparkle * 0.65, 100);

    // Silver palette: near-zero saturation, brightness varies grey→white
    let s = map(sparkle, 0, 100, 15, 0);

    noStroke();
    fill(0, s, bright);
    circle(x, y, sz);

    if (sparkle > 72) {
      let alpha = map(sparkle, 72, 100, 0, 0.95);
      let len   = sz * map(sparkle, 72, 100, 1, 5.5);
      stroke(0, 0, 100, alpha);
      strokeWeight(0.5);
      line(x - len, y, x + len, y);
      line(x, y - len, x, y + len);
      line(x - len * 0.55, y - len * 0.55, x + len * 0.55, y + len * 0.55);
      line(x - len * 0.55, y + len * 0.55, x + len * 0.55, y - len * 0.55);
    }
  }

  pop();

  // Red cursor circle
  noStroke();
  fill(0, 100, 100);
  circle(mouseX, mouseY, 36);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}