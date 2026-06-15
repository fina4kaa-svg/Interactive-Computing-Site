

let video;
let prevFrame;
let grayVideo;
let colorVideo; 

const vidW = 800, vidH = 400;
let offsetX, offsetY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(vidW, vidH);
  video.hide();
  offsetX = (width - vidW) / 2;
  offsetY = (height - vidH) / 2;
  grayVideo = createGraphics(vidW, vidH);
  colorVideo = createGraphics(vidW, vidH); 
}

function draw() {
  if (!prevFrame) {
    prevFrame = video.get(0, 0, vidW, vidH);
    return;
  }

  background(0);

  // 흑백 영상
  grayVideo.image(video, 0, 0, vidW, vidH);
  grayVideo.filter(GRAY);
  image(grayVideo, offsetX, offsetY);

  colorVideo.image(video, 0, 0, vidW, vidH);

  video.loadPixels();
  prevFrame.loadPixels();

  for (let x = 0; x < vidW; x += 10) {
    for (let y = 0; y < vidH; y += 10) {
      let index = (x + y * vidW) * 4;
      let distance = dist(
        video.pixels[index], video.pixels[index+1], video.pixels[index+2],
        prevFrame.pixels[index], prevFrame.pixels[index+1], prevFrame.pixels[index+2]
      );

      if (distance > 80) {
        let cx = x + offsetX;
        let cy = y + offsetY;

        let sw = random(50, 220);
        let sh = random(10, 100);
        let dx = cx + random(-40, 40);
        let dy = cy + random(-20, 20);
        copy(colorVideo, x, y, sw, sh, dx, dy, sw, sh);
      }
    }
  }

  if (frameCount % 3 === 0) {
    prevFrame = video.get(0, 0, vidW, vidH);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  offsetX = (width - vidW) / 2;
  offsetY = (height - vidH) / 2;
}