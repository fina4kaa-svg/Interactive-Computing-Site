
// let x, y;
// let rad1 = 0,
//     rad2 = 0;
// let lineX = 0;
// let lineY = 290;

// function setup() {
// 	createCanvas(windowWidth, windowHeight);
// 	x = width/2;
// 	y = height/2;
// }

// function draw() {
// 	background('#434650'); // 434650, EFE899
// 	noStroke();

// 	for (let x = 0; x < width; x += 300) {
// 		for (let y = 0; y < height; y += 300) {
// 			push();
// 			translate(x, y);
// 			rotate(rad2);
// 			fill('#449E47');
//       beginShape();
//       vertex(-121, -151);
//       bezierVertex(-142, -132, -141, 126, -130, 160);
//       bezierVertex(-123, 182, 89, 172, 111, 150);
//       bezierVertex(134, 129, 149, -149, 122, -164);
//       bezierVertex(95, -179, -101, -170,-121, -151);
//       endShape();
//       pop();


// 		}
// 	}

//     stroke('#634433');
//     strokeWeight(20);
//     strokeCap(SQUARE);
//     noFill();
//     line(lineX - 500, lineY + 7, lineX + 500, lineY + 7);

//     lineX += 3;

//     if (lineX - 500 > width) {
//         lineX = -500;
//         lineY += 300; // 한 행 아래로
//         if (lineY > height) lineY = 0; // 마지막 행 지나면 처음으로
//     }

//     noStroke();
// 	for (let x = 0; x < width; x += 300) {
// 		for (let y = 0; y < height; y += 300) {
// 			push();
// 			translate(x, y);
// 			rotate(rad1);
// 			fill('#E93842');
// 			beginShape();
//       vertex(-38, -51);
//       bezierVertex(-45, -45, -47, 60, -45, 65);
//       bezierVertex(-43, 67, 26, 64, 29, 63);
//       bezierVertex(33, 61, 39, -56, 36, -56);
//       bezierVertex(28, -58, -36, -54, -38, -51);
// 			endShape();
// 			pop();
// 		}
// 	}


// 	rad1 += PI / 180;
// 	rad2 -= PI / 720;
// }


// let x, y;
let rad1 = 0,
	rad2 = 0;
let lineX = 0;
let lineY = 290;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// x = width/2;
	// y = height/2;
}

function draw() {
	background('#434650'); // 434650, EFE899
	noStroke();

	for (let x = 0; x < width + 1000; x += 150) {
		for (let y = 0; y < height + 1000; y += 150) {
			push();
			translate(x, y);
			rotate(rad2);
			scale(0.5);
			fill('#449E47');
			beginShape();
			vertex(-121, -151);
			bezierVertex(-142, -132, -141, 126, -130, 160);
			bezierVertex(-123, 182, 89, 172, 111, 150);
			bezierVertex(134, 129, 149, -149, 122, -164);
			bezierVertex(95, -179, -101, -170, -121, -151);
			endShape();
			pop();

		}
	}

	stroke('#634433');
	strokeWeight(10);
	strokeCap(SQUARE);
	noFill();
	line(lineX - 300, lineY + 7, lineX + 300, lineY + 7);

	lineX += 20;

	if (lineX - 500 > width) {
		lineX = -500;
		lineY += 150; // 한 행 아래로
		if (lineY > height) lineY = 0; // 마지막 행 지나면 처음으로
	}

	noStroke();
	for (let x = 0; x < width + 1000; x += 150) {
		for (let y = 0; y < height + 1000; y += 150) {
			push();
			translate(x, y);
			rotate(rad1);
			fill('#E93842');
			scale(0.5);
			beginShape();
			vertex(-38, -51);
			bezierVertex(-45, -45, -47, 60, -45, 65);
			bezierVertex(-43, 67, 26, 64, 29, 63);
			bezierVertex(33, 61, 39, -56, 36, -56);
			bezierVertex(28, -58, -36, -54, -38, -51);
			endShape();
			pop();
		}
	}

	rad1 += PI / 60;
	rad2 -= PI / 360;
}