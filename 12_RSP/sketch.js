// Classifier
let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/WUHsHMW7N/';

// Assets
let video;
let computerImg, stickYou, stickComp;
let emojiRock, emojiScissors, emojiPaper;
let faceWin, faceLose, faceDraw;

// Game state: "start" | "playing" | "result"
let gameState = "start";
let playerLabel  = "";   // live, always updated by classifier
let playerChoice = "";   // frozen at the moment space is pressed
let confidence   = 0;
let computerChoice = "";
let result = "";

const CHOICES = ["Rock", "Scissors", "Paper"];

function preload() {
  classifier    = ml5.imageClassifier(imageModelURL + 'model.json', { flipped: true });
  computerImg   = loadImage('image 2.png');
  stickYou      = loadImage('stickfigureyou.png');
  stickComp     = loadImage('stickfigurecomputer.png');
  emojiRock     = loadImage('👊.png');
  emojiScissors = loadImage('✌️.png');
  emojiPaper    = loadImage('✋.png');
  faceWin  = loadImage('☹️.png');
  faceLose = loadImage('😝.png');
  faceDraw = loadImage('🤭.png');
}

const HEADER_H = 110;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - HEADER_H);
  cnv.position(0, HEADER_H);
  textFont('Arial Narrow');
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  classifier.classifyStart(video, gotResult);
}

function draw() {
  textFont('Arial Narrow');
  if      (gameState === "start")   drawStart();
  else if (gameState === "playing") drawPlaying();
  else if (gameState === "result")  drawResult();
  else if (gameState === "draw")    drawDraw();
}

// ─── SHARED LAYOUT ────────────────────────────────────────────────────────────

function getLayout() {
  let headR   = height * 0.07;
  let figY    = height * 0.20;        // top of head — lower = more overlap with body
  let bodyY   = figY + headR * 1.2;  // body starts inside head so they overlap
  let figH    = (height - bodyY - height * 0.05) * 0.72;
  let leftCX  = width * 0.20;
  let rightCX = width * 0.88;   // computer head+body together

  return { headR, figY, bodyY, figH, leftCX, rightCX };
}

// Arm tip positions — derived from stick figure image proportions
function armPositions(l) {
  let youFigW  = l.figH * (stickYou.width  / stickYou.height);
  // right arm of stickYou tip: ~97% x, ~22% y of image
  let youArmX  = (l.leftCX  - youFigW * 0.28) + youFigW * 0.97;
  let youArmY  = l.bodyY + l.figH * 0.22;

  let compFigW = l.figH * (stickComp.width / stickComp.height);
  // left arm of stickComp tip: ~3% x, ~37% y of image
  let compArmX = (l.rightCX - compFigW * 0.5) + compFigW * 0.03;
  let compArmY = l.bodyY + l.figH * 0.18;

  return { youArmX, youArmY, compArmX, compArmY };
}

// ─── START PAGE ───────────────────────────────────────────────────────────────

function drawStart() {
  background(0, 0, 255);

  fill(255, 220, 0); noStroke();
  textAlign(CENTER, TOP);
  textSize(min(width * 0.12, 110));
  text("hello.", width / 2, height * 0.05);
  textSize(min(width * 0.045, 42));
  text("let's play rock, paper, scissors !", width / 2, height * 0.2);

  let camW = width * 0.28;
  let camH = camW * (3 / 4);
  let camX = width * 0.22 - camW / 2;
  let camY = height * 0.38;

  image(video, camX, camY, camW, camH);
  noFill(); stroke(0); strokeWeight(3);
  rect(camX, camY, camW, camH);

  let compW = width * 0.22;
  let compH = compW * (computerImg.height / computerImg.width);
  let compX = width * 0.72 - compW / 2;
  let compY = camY + (camH - compH) / 2;
  imageMode(CORNER);
  image(computerImg, compX, compY, compW, compH);

  fill(255, 220, 0); noStroke();
  textSize(min(width * 0.06, 56));
  textAlign(CENTER, CENTER);
  text("vs", width / 2, camY + camH / 2);

  fill(255, 220, 0); noStroke();
  textSize(28); textAlign(CENTER, TOP);
  text("you", camX + camW / 2, camY + camH + 16);
  text("me, the computer", compX + compW / 2, camY + camH + 16);

  drawButton("sure", width / 2, height * 0.85, 200, 60);
}

// ─── PLAYING PAGE ─────────────────────────────────────────────────────────────

function drawPlaying() {
  background(0, 0, 255);
  let l = getLayout();

  fill(255, 220, 0); noStroke();
  textSize(min(width * 0.045, 42));
  textAlign(CENTER, TOP);
  text("bring your hand close to the camera.", width / 2, height * 0.04);

  drawFigure(stickYou,  l.leftCX,  l.figY, l.bodyY, l.figH, l.headR, video, null);
  drawFigure(stickComp, l.rightCX, l.figY, l.bodyY, l.figH, l.headR, null, computerImg);

  // Live label + confidence near webcam circle
  fill(255, 220, 0); noStroke();
  textSize(12); textAlign(LEFT, TOP);
  text(playerLabel + '  ' + nf(confidence * 100, 1, 0) + '%',
       l.leftCX + l.headR + 8, l.figY + l.headR - 8);

  // Live emoji at player arm tip — updates in real time as hand changes
  let liveEmoji = getEmojiImg(playerLabel);
  if (liveEmoji) {
    let { youArmX, youArmY } = armPositions(l);
    let eSz = height * 0.18;
    imageMode(CENTER);
    image(liveEmoji, youArmX, youArmY, eSz, eSz);
    imageMode(CORNER);
    fill(255, 220, 0); noStroke();
    textSize(18); textAlign(CENTER, TOP);
    text(playerLabel.toLowerCase(), youArmX, youArmY + eSz / 2 + 6);
  }

  fill(255, 220, 0); noStroke();
  textSize(min(width * 0.04, 36));
  textAlign(CENTER, BOTTOM);
  text("press space to play.", width / 2, height * 0.97);
}

// ─── RESULT PAGE ──────────────────────────────────────────────────────────────

function drawResult() {
  background(0, 0, 255);
  let l = getLayout();

  fill(255); noStroke();
  textSize(min(width * 0.13, 120));
  textAlign(CENTER, TOP);
  if      (result === "Win")  text("YOU WON....",   width / 2, height * 0.01);
  else if (result === "Lose") text("HA! YOU LOST.",  width / 2, height * 0.01);
  else                        text("DRAW.",           width / 2, height * 0.01);

  drawFigure(stickYou,  l.leftCX,  l.figY, l.bodyY, l.figH, l.headR, video, null);
  drawFigure(stickComp, l.rightCX, l.figY, l.bodyY, l.figH, l.headR, null, computerImg);
  drawComputerFace(l, result === "Win" ? faceWin : faceLose);

  let { youArmX, youArmY, compArmX, compArmY } = armPositions(l);
  let eSz = height * 0.18;

  let playerEmoji   = getEmojiImg(playerChoice);
  let computerEmoji = getEmojiImg(computerChoice);

  imageMode(CENTER);
  if (playerEmoji)   image(playerEmoji,   youArmX,  youArmY,  eSz, eSz);
  if (computerEmoji) image(computerEmoji, compArmX, compArmY, eSz, eSz);
  imageMode(CORNER);

  fill(255, 220, 0); noStroke(); textSize(18); textAlign(CENTER, TOP);
  if (playerEmoji)   text(playerChoice.toLowerCase(),    youArmX,  youArmY  + eSz / 2 + 6);
  if (computerEmoji) text(computerChoice.toLowerCase(),  compArmX, compArmY + eSz / 2 + 6);

  drawButton("again?", width / 2, height * 0.87, 220, 60);
}

// ─── DRAW PAGE (JJI-JJI-PPONG) ───────────────────────────────────────────────

function drawDraw() {
  background(0, 0, 255);
  let l = getLayout();

  // Title
  fill(255); noStroke();
  textSize(min(width * 0.13, 120));
  textAlign(CENTER, TOP);
  text("JJI-JJI-PPONG!", width / 2, height * 0.01);

  drawFigure(stickYou,  l.leftCX,  l.figY, l.bodyY, l.figH, l.headR, video, null);
  drawFigure(stickComp, l.rightCX, l.figY, l.bodyY, l.figH, l.headR, null, computerImg);
  drawComputerFace(l, faceDraw);

  let { youArmX, youArmY, compArmX, compArmY } = armPositions(l);
  let eSz = height * 0.18;

  let emoji = getEmojiImg(playerChoice);
  imageMode(CENTER);
  if (emoji) {
    image(emoji, youArmX,  youArmY,  eSz, eSz);
    image(emoji, compArmX, compArmY, eSz, eSz);
  }
  imageMode(CORNER);

  fill(255, 220, 0); noStroke(); textSize(18); textAlign(CENTER, TOP);
  if (emoji) {
    text(playerChoice.toLowerCase(),  youArmX,  youArmY  + eSz / 2 + 6);
    text(computerChoice.toLowerCase(), compArmX, compArmY + eSz / 2 + 6);
  }

  drawButton("again?", width / 2, height * 0.87, 220, 60);
}

// ─── DRAW A STICK FIGURE WITH HEAD ────────────────────────────────────────────

function drawFigure(figImg, cx, figY, bodyY, figH, headR, webcam, headImg) {
  let figW = figH * (figImg.width / figImg.height);
  // Spine position within each image (fraction of figW from left edge)
  // stickYou: spine at ~28%, stickComp: spine at ~60%
  let spineF = (figImg === stickYou) ? 0.28 : 0.60;
  let figX   = cx - figW * spineF;

  image(figImg, figX, bodyY, figW, figH);

  // Head centered on the actual spine top
  let hx = figX + figW * spineF; // = cx always for stickYou; corrected for stickComp
  let hy = figY + headR;

  if (webcam) {
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(hx, hy, headR, 0, Math.PI * 2);
    drawingContext.clip();
    image(webcam, hx - headR, hy - headR, headR * 2, headR * 2);
    drawingContext.restore();
    noFill(); stroke(0); strokeWeight(3);
    circle(hx, hy, headR * 2);
  } else if (headImg) {
    let aspect = headImg.height / headImg.width;
    let hw = headR * 2.2;
    let hh = hw * aspect;
    imageMode(CENTER);
    image(headImg, hx, hy, hw, hh);
    imageMode(CORNER);
  }
}

// Overlays a face emoji on the computer monitor screen area
function drawComputerFace(l, faceImg) {
  if (!faceImg) return;
  let aspect = computerImg.height / computerImg.width;
  let hw = l.headR * 2.2;
  let hh = hw * aspect;
  let fx = l.rightCX - hw * 0.05;
  let fy = l.figY + l.headR - hh * 0.18;
  let fsz = hw * 0.75;
  try {
    imageMode(CENTER);
    image(faceImg, fx, fy, fsz, fsz);
  } catch(e) {}
  imageMode(CORNER); // always restore, even if image() throws
}

// ─── BUTTON HELPER ────────────────────────────────────────────────────────────

function drawButton(label, cx, cy, w, h) {
  let x = cx - w / 2, y = cy - h / 2;
  fill(0, 0, 180); noStroke();
  rect(x + 8, y + 8, w, h);
  fill(255); stroke(0); strokeWeight(2);
  rect(x, y, w, h);
  fill(0); noStroke();
  textSize(32); textAlign(CENTER, CENTER);
  text(label, cx, cy);
}

// ─── INPUT ────────────────────────────────────────────────────────────────────

function mousePressed() {
  if (gameState === "start") {
    if (overButton(width / 2, height * 0.85, 200, 60)) gameState = "playing";
  } else if (gameState === "result" || gameState === "draw") {
    if (overButton(width / 2, height * 0.87, 220, 60)) {
      playerChoice = ""; computerChoice = ""; result = "";
      gameState = "playing";
    }
  }
}

function overButton(cx, cy, w, h) {
  return mouseX > cx - w/2 && mouseX < cx + w/2 &&
         mouseY > cy - h/2 && mouseY < cy + h/2;
}

function keyPressed() {
  if (gameState === "playing" && key === ' ') {
    let lower = playerLabel.toLowerCase();
    console.log("playerLabel:", playerLabel); // check actual model label in browser console
    if (lower !== "" && lower !== "nothing" && lower !== "default") {
      playerChoice   = normalizeLabel(playerLabel);
      computerChoice = random(CHOICES);
      result         = getResult(playerChoice, computerChoice);
      console.log("playerChoice:", playerChoice, "computerChoice:", computerChoice, "result:", result);
      gameState      = result === "Draw" ? "draw" : "result";
    }
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Normalize whatever label the model returns → "Rock" / "Scissors" / "Paper"
function normalizeLabel(label) {
  let l = label.toLowerCase();
  if (l.includes("rock") || l.includes("바위")) return "Rock";
  if (l.includes("sciss") || l.includes("가위")) return "Scissors";
  if (l.includes("paper") || l.includes("보"))   return "Paper";
  return label; // fallback: return as-is
}

function getResult(player, computer) {
  if (player === computer) return "Draw";
  if (
    (player === "Rock"     && computer === "Scissors") ||
    (player === "Scissors" && computer === "Paper")    ||
    (player === "Paper"    && computer === "Rock")
  ) return "Win";
  return "Lose";
}

function getEmojiImg(choice) {
  if (choice === "Rock")     return emojiRock;
  if (choice === "Scissors") return emojiScissors;
  if (choice === "Paper")    return emojiPaper;
  return null;
}

function gotResult(results) {
  playerLabel = results[0].label;
  confidence  = results[0].confidence;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - HEADER_H);
}
