// let colors = ['#FFA83F', '#47E45E', '#F74F4F', '#F6FC46'];

// let w = 400; // 사각형 크기

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   noLoop();
// }

// let cols = ceil(width / w);
//   let rows = ceil(height / w);

//   // 이중 루프를 사용하여 격자 생성
//   for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//       let x = i * w;
//       let y = j * w;
//       drawCell(x, y, w);
//     }
//   }

// function draw() {
//   drawCell(0, 0, w);
// }

// function drawCell(x, y, w) {
//   let bgColor = random(colors);
//   fill(bgColor);
//   noStroke();
//   rect(x, y, w, w);

//   let otherColors = colors.filter(c => c !== bgColor);
//   let loopColor = random(otherColors);

//   let corners = [
//     {cx: x,     cy: y,     start: 0,        end: HALF_PI      },  // 좌상
//     {cx: x + w, cy: y,     start: HALF_PI,  end: PI           },  // 우상
//     {cx: x,     cy: y + w, start: -HALF_PI, end: 0            },  // 좌하
//     {cx: x + w, cy: y + w, start: PI,       end: PI + HALF_PI },  // 우하
//   ];

//   let corner = random(corners);

//   strokeWeight(100);   // 루프 두께
//   stroke(loopColor);
//   noFill();
//   arc(corner.cx, corner.cy, w, w, corner.start, corner.end, SQUARE);
// }

// function windowResized() {
// 	resizeCanvas(windowWidth, windowHeight);

// 	redraw();

// }

let colors = ['#FFA83F', '#47E45E', '#F74F4F', '#F6FC46', '#6FFF85'];
let w = 200; // 이미지 느낌을 내기 위해 크기를 200으로 조정해봤습니다. (원하시면 400으로 수정 가능)

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop(); // 정적 패턴이므로 한 번만 실행
}


function mousePressed() {
	redraw();
}

function draw() {
  background(255);
  
  // 현재 캔버스 크기에 맞춰 필요한 열(cols)과 행(rows) 계산
  let cols = ceil(width / w);
  let rows = ceil(height / w);

  // 이중 루프: 화면 전체를 돌며 사각형을 그림
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * w;
      drawCell(x, y, w);
    }
  }
}

function drawCell(x, y, w) {
  let bgColor = random(colors);
  fill(bgColor);
  noStroke();
  rect(x, y, w, w);

  let otherColors = colors.filter(c => c !== bgColor);
  let loopColor = random(otherColors);

  // 이미지처럼 모서리에 걸친 아크(원형 곡선) 설정
  let corners = [
    {cx: x,     cy: y,     start: 0,        end: HALF_PI      },  // 좌측 상단 기준
    {cx: x + w, cy: y,     start: HALF_PI,  end: PI           },  // 우측 상단 기준
    {cx: x,     cy: y + w, start: -HALF_PI, end: 0            },  // 좌측 하단 기준
    {cx: x + w, cy: y + w, start: PI,       end: PI + HALF_PI },  // 우측 하단 기준
  ];

  let corner = random(corners);

  // strokeWeight을 w의 비율로 설정
  strokeWeight(w / 3.5); 
  stroke(loopColor);
  strokeCap(SQUARE);
  noFill();
  
  // 이미지와 같은 느낌을 위해 아크 지름을 w로 설정
  arc(corner.cx, corner.cy, w, w, corner.start, corner.end);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw(); 
}