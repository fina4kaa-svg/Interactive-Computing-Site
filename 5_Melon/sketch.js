// // // let seeds = [];
// // // let seedW = 21, seedH = 30;
// // // let cols = 12, rows = 8;

// // // function setup() {
// // //   createCanvas(windowWidth, windowHeight);
// // //   initSeeds();
// // // }

// // // function draw() {
// // //   drawGradient();

// // //   // 마우스 클릭 시 즉시 재배치 (mousePressed 함수 대체)
// // //   if (mouseIsPressed) initSeeds();

// // //   for (let s of seeds) {
// // //     s.render();
// // //   }
// // // }

// // // function initSeeds() {
// // //   seeds = [];
// // //   let cellW = width / cols, cellH = height / rows;
// // //   for (let i = 0; i < cols; i++) {
// // //     for (let j = 0; j < rows; j++) {
// // //       let x = (i + 0.5) * cellW + random(-15, 15);
// // //       let y = (j + 0.5) * cellH + random(-15, 15);
// // //       // 수박의 빨간 부분(30% ~ 70%)에만 배치
// // //       if (y > height * 0.3 && y < height * 0.7 && random() > 0.3) {
// // //         seeds.push(new Seed(x, y));
// // //       }
// // //     }
// // //   }
// // // }

// // // function drawGradient() {
// // //   let ctx = drawingContext;
// // //   let grad = ctx.createLinearGradient(0, 0, 0, height);
// // //   [['#71E069', 0], ['#FFF', 0.1], ['#FF2121', 0.5], ['#FFF', 0.9], ['#71E069', 1]]
// // //     .forEach(c => grad.addColorStop(c[1], c[0]));
// // //   ctx.fillStyle = grad;
// // //   ctx.fillRect(0, 0, width, height);
// // // }

// // // class Seed {
// // //   constructor(x, y) {
// // //     this.pos = createVector(x, y);
// // //     this.maxDist = 250;
// // //   }

// // //   render() {
// // //     let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
// // //     let active = d < this.maxDist;
// // //     let scl = active ? map(d, 0, this.maxDist, 2.5, 1, true) : 1;
// // //     let angle = active ? map(d, 0, this.maxDist, TWO_PI * 10, 0, true) : 0;

// // //     push();
// // //     translate(this.pos.x, this.pos.y);
// // //     rotate(angle);
// // //     scale(scl);
// // //     noStroke();
// // //     fill(35, 14, 14);
// // //     ellipse(0, 0, seedW, seedH);
// // //     pop();
// // //   }
// // // }

// // let seeds = [];
// // let seedW = 21, seedH = 30;
// // let cols = 12, rows = 8;

// // function setup() {
// //   createCanvas(windowWidth, windowHeight);
// //   initSeeds();
// // }

// // function draw() {
// //   drawGradient();

// //   // 마우스 클릭 시 즉시 재배치
// //   if (mouseIsPressed) initSeeds();

// //   for (let s of seeds) {
// //     s.show();
// //   }
// // }

// // function initSeeds() {
// //   seeds = [];
// //   let cellW = width / cols, cellH = height / rows;
// //   let redTop = height * 0.3;
// //   let redBottom = height * 0.7;

// //   for (let i = 0; i < cols; i++) {
// //     for (let j = 0; j < rows; j++) {
// //       let x = (i + 0.5) * cellW + random(-15, 15);
// //       let y = (j + 0.5) * cellH + random(-15, 15);

// //       if (y > redTop && y < redBottom && random() > 0.3) {
// //         seeds.push(new Seed(x, y));
// //       }
// //     }
// //   }
// // }

// // function drawGradient() {
// //   let ctx = drawingContext;
// //   let grad = ctx.createLinearGradient(0, 0, 0, height);
// //   let colors = [['#71E069', 0], ['#FFFFFF', 0.1], ['#FF2121', 0.5], ['#FFFFFF', 0.9], ['#71E069', 1]];
// //   colors.forEach(c => grad.addColorStop(c[1], c[0]));
// //   ctx.fillStyle = grad;
// //   ctx.fillRect(0, 0, width, height);
// // }

// // class Seed {
// //   constructor(x, y) {
// //     this.x = x;
// //     this.y = y;
// //     this.maxDist = 250;
// //   }

// //   show() {
// //     let d = dist(mouseX, mouseY, this.x, this.y);
    
    
// //     let scl = 1;
// //     let angle = 0;

// //     if (d < this.maxDist) {
// //       scl = map(d, 0, this.maxDist, 2.5, 1, true);
// //       angle = map(d, 0, this.maxDist, TWO_PI * 3, 0, true); //회전 속도 조절
// //     }

// //     push();
// //     translate(this.x, this.y);
// //     rotate(angle);
// //     scale(scl);
// //     noStroke();
// //     fill('#230E0E');
// //     ellipse(0, 0, seedW, seedH);
// //     pop();
// //   }
// // }

// // function windowResized() {
// //   resizeCanvas(windowWidth, windowHeight);
// //   initSeeds();
// // }


// let seeds = [];
// let seedW = 21, seedH = 30;
// let cols = 12, rows = 8;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
  
//   for (let i = 0; i < cols * rows; i++) {
//     let x = random(width);
//     let y = random(height * 0.3, height * 0.7);
//     if (random() > 0.4) seeds.push(new Seed(x, y));
//   }
// }

// function draw() {
//   // 1. 수박 그라데이션 배경
//   let ctx = drawingContext;
//   let grad = ctx.createLinearGradient(0, 0, 0, height);
//   [['#71E069', 0], ['#FFF', 0.1], ['#FF2121', 0.5], ['#FFF', 0.9], ['#71E069', 1]]
//     .forEach(c => grad.addColorStop(c[1], c[0]));
//   ctx.fillStyle = grad;
//   ctx.fillRect(0, 0, width, height);


//   // 3. 씨앗
//   for (let s of seeds) s.show();
// }

// class Seed {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }

//   show() {
//     let scl = 1;
//     let angle = 0;

//     // 마우스가 가까우면 변화 계산 (익숙한 if 문 사용)
//     if (d < this.maxDist) {
//       // 거리가 가까울수록(0에 가까울수록) 크기는 2.5배로
//       scl = map(d, 0, this.maxDist, 2.5, 1, true);
      
//       // 거리가 가까울수록(0에 가까울수록) 많이 회전
//       // TWO_PI * 2는 720도(두 바퀴) 회전입니다. 숫자를 키우면 더 많이 회전합니다.
//       angle = map(d, 0, this.maxDist, TWO_PI * 2, 0, true); 
//     }

//     push();
//     translate(this.x, this.y);
//     rotate(angle);
//     scale(scl);
//     noStroke();
//     fill('#230E0E');
//     ellipse(0, 0, seedW, seedH);
//     pop();
//   }
// }

let seeds = [];
let seedW = 21, seedH = 30;
let cols = 12, rows = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height * 0.3, height * 0.7);
    if (random() > 0.2) {
      seeds.push(new Seed(x, y));
    }
  }
}

function draw() {
  let ctx = drawingContext;
  let grad = ctx.createLinearGradient(0, 0, 0, height);
  [['#71E069', 0], ['#FFF', 0.1], ['#FF2121', 0.5], ['#FFF', 0.9], ['#71E069', 1]]
    .forEach(c => grad.addColorStop(c[1], c[0]));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. 씨앗 그리기
  for (let s of seeds) {
    s.show();
  }
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