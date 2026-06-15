let typingChars = [];
let fallingChars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  textFont('Comic Sans MS');
  textSize(60);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(210, 50, 85);
  noStroke();
  fill(120, 60, 70); // 초록색 HSB
  rect(0, height - 120, width, 1200);
  noStroke();
  fill(0, 0, 100);
  ellipse(width / 2, 180, 500, 200);
  ellipse(width / 2 - 150, 200, 300, 150);
  ellipse(width / 2 + 150, 200, 300, 150);
  ellipse(width / 2 - 80, 150, 280, 150);
  ellipse(width / 2 + 80, 150, 280, 150);

  // 1. 타이핑 중인 글자 표시
  textSize(60);
  let totalWidth = 0;
  for (let i = 0; i < typingChars.length; i++) {
    totalWidth += textWidth(typingChars[i].ch);
  }
  let startX = width / 2 - totalWidth / 2;
  let curX = startX;
  for (let i = 0; i < typingChars.length; i++) {
    let charObj = typingChars[i];
    charObj.x = curX + textWidth(charObj.ch) / 2;
    fill(charObj.col);
    text(charObj.ch, charObj.x, 180);
    curX += textWidth(charObj.ch);
  }

  // 2. 떨어지는 글자
  for (let i = fallingChars.length - 1; i >= 0; i--) {
    fallingChars[i].update();
    fallingChars[i].show();
  }
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    typingChars.pop();
  } else if (keyCode === ENTER) {
    for (let charObj of typingChars) {
      fallingChars.push(new CharBall(charObj.x, 180, charObj.ch, charObj.col));
    }
    typingChars = [];
  } else if (key.length === 1) {
    typingChars.push({ ch: key, x: 0, col: color(random(360), 80, 90) });
  }
  checkOverflow();
}
function checkOverflow() {
  let totalWidth = 0;
  for (let i = 0; i < typingChars.length; i++) {
    totalWidth += textWidth(typingChars[i].ch);
  }
  if (totalWidth > 400) {
    // x 위치 먼저 계산
    let startX = width / 2 - totalWidth / 2;
    let curX = startX;
    for (let i = 0; i < typingChars.length; i++) {
      let charObj = typingChars[i];
      charObj.x = curX + textWidth(charObj.ch) / 2;
      curX += textWidth(charObj.ch);
    }
    for (let charObj of typingChars) {
      fallingChars.push(new CharBall(charObj.x, 180, charObj.ch, charObj.col));
    }
    typingChars = [];
  }
}

class CharBall {
  constructor(x, y, ch, col) {
    this.x = x;
    this.y = y;
    this.ch = ch;
    this.col = col;
    this.vx = random(-8, 8);
    this.vy = random(-8, -2);
    this.g = 0.4;
    this.angle = 0;
    this.bounce = 0.5;
    this.ground = height - 120;
    this.settled = false;
  }

  update() {
    if (this.settled) return;

    this.vy += this.g;
    this.x += this.vx;
    this.y += this.vy;
    this.angle += 5;

    // 좌우 벽
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -this.bounce;
    }
    if (this.x > width) {
      this.x = width;
      this.vx *= -this.bounce;
    }

    // 바닥
    if (this.y >= this.ground) {
      this.y = this.ground;
      this.vy *= -this.bounce;
      this.vx *= 0.8;
      this.angle *= 0.8;

      if (abs(this.vy) < 1) {
        this.vy = 0;
        this.vx = 0;
        this.settled = true;
      }
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    fill(this.col);
    noStroke();
    textSize(60);
    textAlign(CENTER, CENTER);
    text(this.ch, 0, 0);
    pop();
  }
}
