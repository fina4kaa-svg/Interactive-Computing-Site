let faceMesh, handPose;
let faces = [], hands = [];
let video;

let cw, ch;

let gestureState = 'none';
let miniScale    = 0;

let dCX = 0, dCY = 0, dR = 0;
let normalizedDiamondPts = null;

let palmCX = 0, palmCY = 0;
let lastPalmCX = 0, lastPalmCY = 0;
let palmVisible = false;

let pg;
let infoDiv;

// 입 벌리기 → 떨어지는 다이아몬드
let fallingDiamonds = [];
let mouthIsOpen     = false;
let lastSpawnMs     = 0;

function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipHorizontal: true });
  handPose  = ml5.handPose({ flipHorizontal: true });
}

function setup() {
  computeCanvasSize();
  document.body.style.background = '#0787FF';
  document.documentElement.style.background = '#0787FF';
  let cnv = createCanvas(cw, ch);
  positionCanvas(cnv);
  buildInfoDiv();
  pg = createGraphics(ceil(cw * 0.6), ceil(cw * 0.6));
  frameRate(15);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, r => { faces = r; });
  handPose.detectStart(video,  r => { hands = r; });
}

function draw() {
  background(0);

  let vw = video.width  || 1;
  let vh = video.height || 1;
  let sx = cw / vw;
  let sy = ch / vh;

  // ── 1. 미러 영상 ──────────────────────────────────────────
  push();
  translate(cw, 0);
  scale(-1, 1);
  image(video, 0, 0, cw, ch);
  pop();

  // ── 2. 얼굴 랜드마크 → diamond bounding box ───────────────
  if (faces.length > 0) {
    let kps  = faces[0].keypoints;

    // map() 없이 inline 루프 → 배열 생성 제로
    let minX = Infinity, maxX = -Infinity, minY = Infinity;
    for (let i = 0; i < kps.length; i++) {
      let px = kps[i].x * sx, py = kps[i].y * sy;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
    }
    let fcx = (minX + maxX) / 2;

    let pTopX = fcx,             pTopY = minY;
    let pRgtX = kps[454].x * sx, pRgtY = kps[454].y * sy;
    let pBotX = kps[152].x * sx, pBotY = kps[152].y * sy;
    let pLftX = kps[234].x * sx, pLftY = kps[234].y * sy;

    let dMinX = min(pTopX, pRgtX, pBotX, pLftX);
    let dMaxX = max(pTopX, pRgtX, pBotX, pLftX);
    let dMinY = min(pTopY, pRgtY, pBotY, pLftY);
    let dMaxY = max(pTopY, pRgtY, pBotY, pLftY);

    dCX = (dMinX + dMaxX) / 2;
    dCY = (dMinY + dMaxY) / 2;
    dR  = max(dMaxX - dMinX, dMaxY - dMinY) / 2;

    // 배열 재사용 (매 프레임 new 객체 생성 방지)
    if (!normalizedDiamondPts) normalizedDiamondPts = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
    normalizedDiamondPts[0].x = pTopX - dCX; normalizedDiamondPts[0].y = pTopY - dCY;
    normalizedDiamondPts[1].x = pRgtX - dCX; normalizedDiamondPts[1].y = pRgtY - dCY;
    normalizedDiamondPts[2].x = pBotX - dCX; normalizedDiamondPts[2].y = pBotY - dCY;
    normalizedDiamondPts[3].x = pLftX - dCX; normalizedDiamondPts[3].y = pLftY - dCY;

    // 입 벌림 감지
    let mouthGap = dist(kps[13].x * sx, kps[13].y * sy,
                        kps[14].x * sx, kps[14].y * sy);
    mouthIsOpen = mouthGap > dR * 0.18;
  }

  // ── 3. 손 제스처 ──────────────────────────────────────────
  if (hands.length > 0) {
    let kps   = hands[0].keypoints;
    let wrist = kps[0];

    let extCount = 0;
    for (let ti of [8, 12, 16, 20]) {
      let mi = ti - 3;
      if (dist(kps[ti].x, kps[ti].y, wrist.x, wrist.y) >
          dist(kps[mi].x,  kps[mi].y,  wrist.x, wrist.y)) extCount++;
    }
    if      (extCount >= 3) gestureState = 'open';
    else if (extCount <= 1) gestureState = 'fist';

    palmCX = 0; palmCY = 0;
    for (let i of [0, 5, 9, 13, 17]) {
      palmCX += kps[i].x * sx;
      palmCY += kps[i].y * sy;
    }
    palmCX /= 5; palmCY /= 5;
    lastPalmCX = palmCX;
    lastPalmCY = palmCY;
    palmVisible = true;
  } else {
    gestureState = 'none';
    palmVisible  = false;
  }

  // ── 3b. 떨어지는 다이아몬드 스폰 & 드로우 ───────────────────
  if (mouthIsOpen && dR > 0) {
    let now = millis();
    if (now - lastSpawnMs > 333) {           // 초당 3개
      fallingDiamonds.push({
        x:  random(dR, cw - dR),
        y:  -dR,
        r:  dR * random(0.5, 1.1), // <물방울 크기 랜덤 범위
        vy: random(180, 320)                 // px/sec
      });
      lastSpawnMs = now;
    }
  }

  noStroke();
  fill('#0787FF');
  for (let i = fallingDiamonds.length - 1; i >= 0; i--) {
    let d = fallingDiamonds[i];
    d.y += d.vy * deltaTime / 1000;
    if (d.y - d.r > ch) { fallingDiamonds.splice(i, 1); continue; }
    beginShape();
    vertex(d.x, d.y - d.r);                        // 위 뾰족 끝
    bezierVertex(d.x + d.r * 0.95, d.y - d.r * 0.2,
                 d.x + d.r * 0.7,  d.y + d.r * 0.9,
                 d.x,              d.y + d.r);      // 오른쪽 → 바닥 중심
    bezierVertex(d.x - d.r * 0.7,  d.y + d.r * 0.9,
                 d.x - d.r * 0.95, d.y - d.r * 0.2,
                 d.x,              d.y - d.r);      // 왼쪽 → 꼭대기
    endShape(CLOSE);
  }

  // ── 4. 애니메이션 ─────────────────────────────────────────
  let target = (gestureState === 'open') ? 1.0 : 0.0;
  miniScale = lerp(miniScale, target, 0.08);

  if (miniScale < 0.02 || !normalizedDiamondPts || dR <= 0) return;

  let s = miniScale;

  // ── 5. 얼굴 위 파란 물방울 ──────────────────────────────────
  let fCX = normalizedDiamondPts[0].x + dCX;          // 이마 x ≈ 얼굴 중심 x
  let fTopY = normalizedDiamondPts[0].y + dCY;        // 이마 y (뾰족 끝)
  let fBotY = normalizedDiamondPts[2].y + dCY;        // 턱 y (둥근 끝)
  let fRgtX = normalizedDiamondPts[1].x + dCX;        // 오른 광대 x
  let fLftX = normalizedDiamondPts[3].x + dCX;        // 왼 광대 x
  let fH    = fBotY - fTopY;

  noStroke();
  fill('#0787FF');
  beginShape();
  vertex(fCX, fTopY);
  // 오른쪽: cp1 = 광대 x, 꼭대기에서 40% 아래 → 뾰족 유지
  bezierVertex(fRgtX,                      fTopY + fH * 0.4,
               fCX + (fRgtX - fCX) * 0.63, fBotY,
               fCX,                         fBotY);
  // 왼쪽: 대칭
  bezierVertex(fCX - (fCX - fLftX) * 0.63, fBotY,
               fLftX,                      fTopY + fH * 0.4,
               fCX,                         fTopY);
  endShape(CLOSE);

  // ── 6. pg에 실시간 영상 그리기 (get() 없음) ───────────────
  // pg 크기: dR이 25px 이상 바뀔 때만 재생성 (매 프레임 생성 방지)
  let desiredFw = ceil(dR * 2);
  if (abs(pg.width - desiredFw) > 200) {
    pg.resizeCanvas(desiredFw, desiredFw);
  }
  let fw = pg.width; // 실제 pg 크기 기준으로 통일

  pg.clear();

  // 마름모 bbox 영역만 크롭 + 미러 (transform으로 처리, 음수 srcW 없음 → Safari 호환)
  let halfFw = fw / 2;
  let cropX = vw - (dCX + halfFw) * vw / cw; // 원본 비디오 기준 크롭 시작점
  let cropY = (dCY - halfFw) * vh / ch;
  let cropW = fw * vw / cw;
  let cropH = fw * vh / ch;
  pg.push();
  pg.translate(fw, 0);
  pg.scale(-1, 1);
  pg.image(video, 0, 0, fw, fw, cropX, cropY, cropW, cropH);
  pg.pop();

  // 마름모 바깥 전체를 지움 (외부 사각형 - 내부 마름모 구멍)
  // normalizedDiamondPts는 dR 기준이므로 fw 기준으로 스케일
  let ptS = halfFw / dR;
  let hw  = halfFw;
  let tPt = { x: hw + normalizedDiamondPts[0].x * ptS, y: hw + normalizedDiamondPts[0].y * ptS };
  let rPt = { x: hw + normalizedDiamondPts[1].x * ptS, y: hw + normalizedDiamondPts[1].y * ptS };
  let bPt = { x: hw + normalizedDiamondPts[2].x * ptS, y: hw + normalizedDiamondPts[2].y * ptS };
  let lPt = { x: hw + normalizedDiamondPts[3].x * ptS, y: hw + normalizedDiamondPts[3].y * ptS };

  pg.erase();
  pg.noStroke();
  pg.beginShape();
  pg.vertex(0,  0);
  pg.vertex(fw, 0);
  pg.vertex(fw, fw);
  pg.vertex(0,  fw);
  pg.beginContour();                     // 물방울 구멍 (반시계방향)
  let pgH = bPt.y - tPt.y;
  pg.vertex(tPt.x, tPt.y);
  pg.bezierVertex(lPt.x,                          tPt.y + pgH * 0.4,
                  tPt.x - (tPt.x - lPt.x) * 0.63, bPt.y,
                  bPt.x,                           bPt.y);
  pg.bezierVertex(tPt.x + (rPt.x - tPt.x) * 0.63, bPt.y,
                  rPt.x,                            tPt.y + pgH * 0.4,
                  tPt.x,                            tPt.y);
  pg.endContour();
  pg.endShape(CLOSE);
  pg.noErase();

  // ── 7. 마스킹된 영상 → 손 위에 ──────────────────────────
  let px = palmVisible ? palmCX : lastPalmCX;
  let py = palmVisible ? palmCY : lastPalmCY;
  let destSize = fw * s;

  image(pg, px - destSize / 2, py - destSize / 2, destSize, destSize);
}

// ── helpers ──────────────────────────────────────────────────

function buildInfoDiv() {
  if (infoDiv) infoDiv.remove();
  infoDiv = createDiv(
    '1. Lift your hand 🤚<br>2. Close your hand ✊<br>3. Open your mouth 👄'
  );
  infoDiv.style('position',    'absolute');
  infoDiv.style('color',       'white');
  infoDiv.style('font-family', 'sans-serif');
  infoDiv.style('font-size',   '15px');
  infoDiv.style('line-height', '1.8');
  infoDiv.style('text-align',  'center');
  infoDiv.style('pointer-events', 'none');
  infoDiv.style('width', cw + 'px');
  positionInfoDiv();
}

function positionInfoDiv() {
  if (!infoDiv) return;
  let canvasTop = floor((windowHeight - ch) / 2);
  infoDiv.style('left', floor((windowWidth - cw) / 2) + 'px');
  infoDiv.style('top',  max(10, canvasTop - 100) + 'px');
}

function computeCanvasSize() {
  cw = floor(windowWidth  * 0.5);
  ch = floor(cw * 9 / 16);
}

function positionCanvas(cnv) {
  cnv.style('left', floor((windowWidth  - cw) / 2) + 'px');
  cnv.style('top',  floor((windowHeight - ch) / 2) + 'px');
}

function windowResized() {
  computeCanvasSize();
  resizeCanvas(cw, ch);
  positionCanvas(select('canvas'));
  positionInfoDiv();
}
