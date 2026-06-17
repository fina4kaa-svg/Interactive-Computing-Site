let img;
let tiles = [];
let tileSize;
let cols = 15;
let rows;

function preload() {
  img = loadImage('sheep.png');
}

function setup() {
  let canvas = createCanvas(1656, 1023);
  canvas.style('position', 'absolute');
  canvas.style('left', '50%');
  canvas.style('top', '50%');
  canvas.style('transform', 'translate(-50%, -50%)');
  document.body.style.margin = '0';
  document.body.style.background = '#FFA8EF';

  frameRate(15);
  tileSize = 828 / cols;
  rows = round(1023 / tileSize);

  image(img, 0, 0);

  noStroke();
  fill('#FFA8EF');
  rect(828, 0, 828, height);

  for(let i=0; i<cols; i++) {
    for(let j=0; j<rows; j++) {
      tiles.push({
        x: floor(i * tileSize),
        y: floor(j * tileSize)
      });
    }
  }
}

function draw() {
  if(tiles.length > 0) {
    let index = floor(random(tiles.length));
    let tile = tiles[index];

    let midX = tile.x + tileSize / 2;
    let midY = tile.y + tileSize / 2;
    let c = img.get(midX, midY);

    let lum = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];

    // 왼쪽: 밝기 유지한 핑크로 덮기
    colorMode(HSB, 255);
    fill(220, 87, lum);
    noStroke();
    rect(tile.x, tile.y, ceil(tileSize), ceil(tileSize));
    colorMode(RGB, 255);

    // 오른쪽: 이미지 + 20% 핑크 필터
    let tileImg = img.get(tile.x, tile.y, ceil(tileSize), ceil(tileSize));
    image(tileImg, tile.x + 828, tile.y);
    fill(255, 168, 239, 70);
    noStroke();
    rect(tile.x + 828, tile.y, ceil(tileSize), ceil(tileSize));

    tiles.splice(index, 1);
  }
}
