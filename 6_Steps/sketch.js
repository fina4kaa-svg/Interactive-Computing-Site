// let steps = [];
// let trails = [];
// let trailIdCounter = 0;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   background("#FFF1B7");
// }

// function mousePressed() {
//   if (trails.length >= 6) {
//     let oldId = trails[0].id;
//     steps = steps.filter(s => s.trailId !== oldId);
//     trails.shift();
//   }

//   trails.push({
//     id: trailIdCounter++,
//     x: mouseX,
//     y: mouseY,
//     angle: random(TWO_PI),
//     count: 0,
//     timer: 0,
//     done: false,
//     size: random(15, 30) // 👉 원하는 범위로 조절
//   });
// }

// function isOut(x, y) {
//   return (x < 0 || x > width || y < 0 || y > height);
// }

// function draw() {
//   fill(255, 241, 183, 20);
//   noStroke();
//   rect(0, 0, width, height);

//   for (let t of trails) {

//     // 🔹 이동 로직
//     if (!t.done) {
//       t.timer++;

//       if (t.timer % 15 === 0 && t.count < 30) {
//         let nextX = t.x + cos(t.angle) * 55;
//         let nextY = t.y + sin(t.angle) * 55;

//         if (isOut(nextX, nextY)) {
//           t.done = true;
//         } else {
//           t.x = nextX;
//           t.y = nextY;

//           let side = (t.count % 2 === 0 ? 1 : -1) * 18;
//           let x = t.x + cos(t.angle + HALF_PI) * side;
//           let y = t.y + sin(t.angle + HALF_PI) * side;
//           let rot = t.angle + HALF_PI + (t.count % 2 === 0 ? 0.4 : -0.4);

//           steps.push(new BirdStep(x, y, rot, t.id, t.size));
//           t.count++;
//         }
//       }
//     }

//     // 🔹 trail별 step 관리 (항상 실행!)
//     let sameTrail = [];
//     for (let s of steps) {
//       if (s.trailId === t.id) {
//         sameTrail.push(s);
//       }
//     }

//     // 이동 중 → 6개 유지
//     if (!t.done && sameTrail.length > 6) {
//       let oldest = sameTrail[0];
//       steps.splice(steps.indexOf(oldest), 1);
//     }

//     // 멈춘 후 → 하나씩 줄이기
//     if (t.done && sameTrail.length > 0) {
//       let oldest = sameTrail[0];
//       steps.splice(steps.indexOf(oldest), 1);
//     }
//   }

//   // 🔹 그리기
//   for (let s of steps) {
//     s.show();
//   }
// }

// class BirdStep {
//   constructor(x, y, angle, trailId) {
//     this.x = x;
//     this.y = y;
//     this.angle = angle;
//     this.trailId = trailId;
//     this.d = size;
//   }

//   show() {
//     let path = new Path2D("M96.9997 9C102.523 9 107 13.4772 107 19V72.124L147.703 31.4209C151.255 27.8684 157.015 27.8684 160.567 31.4209C164.12 34.9734 164.12 40.7326 160.567 44.2852L107 97.8525V175C107 180.523 102.523 185 96.9997 185C91.477 185 86.9997 180.523 86.9997 175V98.8525L32.4324 44.2852C28.8801 40.7326 28.8801 34.9734 32.4324 31.4209C35.9849 27.8683 41.745 27.8683 45.2976 31.4209L86.9997 73.123V19C86.9997 13.4772 91.477 9.00014 96.9997 9Z");

//     drawingContext.save();
//     drawingContext.translate(this.x, this.y);
//     drawingContext.rotate(this.angle);
//     drawingContext.scale(this.d / 194, this.d / 194);
//     drawingContext.translate(-97, -97);
//     drawingContext.fillStyle = 'rgb(168,159,125)';
//     drawingContext.fill(path);
//     drawingContext.restore();
//   }
// }

let steps = [];
let trails = [];
let trailIdCounter = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background("#FFF1B7");
}

function mousePressed() {
	if (trails.length >= 6) {
		let oldId = trails[0].id;
		steps = steps.filter(s => s.trailId !== oldId);
		trails.shift();
	}

	trails.push({
		id: trailIdCounter++,
		x: mouseX,
		y: mouseY,
		angle: random(TWO_PI),
		count: 0,
		timer: 0,
		done: false
	});
}

function isOut(x, y) {
	return (x < 0 || x > width || y < 0 || y > height);
}

function draw() {
	fill(255, 241, 183, 20);
	noStroke();
	rect(0, 0, width, height);

	for (let t of trails) {

		if (!t.done) {
			t.timer++;

			if (t.timer % 15 === 0 && t.count < 30) {
				let nextX = t.x + cos(t.angle) * 55;
				let nextY = t.y + sin(t.angle) * 55;

				if (isOut(nextX, nextY)) {
					t.done = true;
				} else {
					t.x = nextX;
					t.y = nextY;

					let side = (t.count % 2 === 0 ? 1 : -1) * 18;
					let x = t.x + cos(t.angle + HALF_PI) * side;
					let y = t.y + sin(t.angle + HALF_PI) * side;
					let rot = t.angle + HALF_PI + (t.count % 2 === 0 ? 0.4 : -0.4);

					steps.push(new BirdStep(x, y, rot, t.id));
					t.count++;
				}
			}
		}

		let sameTrail = [];
		for (let s of steps) {
			if (s.trailId === t.id) {
				sameTrail.push(s);
			}
		}

		if (!t.done && sameTrail.length > 6) {
			let oldest = sameTrail[0];
			steps.splice(steps.indexOf(oldest), 1);
		}

		if (t.done && sameTrail.length > 0) {
			let oldest = sameTrail[0];
			steps.splice(steps.indexOf(oldest), 1);
		}
	}

	for (let s of steps) {
		s.show();
	}

	fill(30);
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(25);
	text('click to walk', width / 2, height / 4);
}

class BirdStep {
	constructor(x, y, angle, trailId) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.trailId = trailId;
		this.d = 40;
	}

	show() {
		let path = new Path2D("M96.9997 9C102.523 9 107 13.4772 107 19V72.124L147.703 31.4209C151.255 27.8684 157.015 27.8684 160.567 31.4209C164.12 34.9734 164.12 40.7326 160.567 44.2852L107 97.8525V175C107 180.523 102.523 185 96.9997 185C91.477 185 86.9997 180.523 86.9997 175V98.8525L32.4324 44.2852C28.8801 40.7326 28.8801 34.9734 32.4324 31.4209C35.9849 27.8683 41.745 27.8683 45.2976 31.4209L86.9997 73.123V19C86.9997 13.4772 91.477 9.00014 96.9997 9Z");

		drawingContext.save();
		drawingContext.translate(this.x, this.y);
		drawingContext.rotate(this.angle);
		drawingContext.scale(this.d / 194, this.d / 194);
		drawingContext.translate(-97, -97);
		drawingContext.fillStyle = 'rgb(168,159,125)';
		drawingContext.fill(path);
		drawingContext.restore();
	}
}