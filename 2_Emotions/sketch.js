function setup() {
  createCanvas(1000, 1000);
}

function draw() {

  //JOY
  let radialGradient = drawingContext.createRadialGradient(180, 245, 40,180, 245, 300 );
  radialGradient.addColorStop(0, '#FFFFFF');
  radialGradient.addColorStop(1, '#FFB300');

  drawingContext.fillStyle = radialGradient;

  noStroke();
  rect(0, 0, 500, 500);

  
  function gradientEllipse(x, y, d) {
  let grad = drawingContext.createLinearGradient(x - d/2, y - d/2, x + d/2, y + d/2);
  grad.addColorStop(0, '#FF7E4A');
  grad.addColorStop(1, '#FF4800');
  drawingContext.fillStyle = grad;
  ellipse(x, y, d);
  }
  stroke('#FF9A72');
  strokeWeight(1);

    gradientEllipse(178, 73, 44);
    gradientEllipse(178, 140-20, 44);
    gradientEllipse(178, 205-20-20-20, 44);
    gradientEllipse(178, 190-20, 44);
    gradientEllipse(178, 215-20, 44);

    // 가로
    
    gradientEllipse(258-10, 195+25+25, 44);
    gradientEllipse(283-10, 195+25+25, 44);
    gradientEllipse(350-10, 195+25+25, 44);
    gradientEllipse(233-10, 195+25+25, 44);
    
    gradientEllipse(142, 195+25+25, 44);
    gradientEllipse(113, 195+25+25, 44);
    gradientEllipse(88, 195+25+25, 44);
    gradientEllipse(63, 195+25+25, 44); 

    // 대각선 오른쪽 
    gradientEllipse(233-20, 233+50+10, 44);
    gradientEllipse(258-20, 258+50+10, 44);
    gradientEllipse(283-20, 283+50+10, 44);
    gradientEllipse(340-20, 340+50+10, 44);
    //대각선
    gradientEllipse(123+30, 233+50+10, 44);
    gradientEllipse(98+30, 258+50+10, 44);
    gradientEllipse(73+30, 283+50+10, 44);
  
  
//SADNESS
noStroke();

let linearGradient = drawingContext.createLinearGradient(750, 0, 750, 500);
  linearGradient.addColorStop(0, '#EAEAEA');
  linearGradient.addColorStop(1, '#616161');
  drawingContext.fillStyle = linearGradient;
rect(500, 0, 500);

//왼쪽 초승달
fill('#434343');
beginShape();
vertex(689+17, 33+20);
bezierVertex(646+17.47, 33+20, 612+17, 92+20, 612+17, 165+20);
bezierVertex(612+17,238+20, 646+17.47, 298+20, 689+17, 298+20);
bezierVertex(731+17.53, 298+20, 689+17, 238+20, 689+17, 165+20);
bezierVertex(689+17, 92+20, 731+17.53, 33+20, 689+17, 33+20);
endShape();
fill('#0D0836');
beginShape();
vertex(689, 33);
bezierVertex(646.47, 33, 612, 92, 612, 165);
bezierVertex(612,238, 646.47, 298, 689, 298);
bezierVertex(731.53, 298, 689, 238, 689, 165);
bezierVertex(689, 92, 731.53, 33, 689, 33);
endShape();

// 오른쪽 초승달 
fill('#434343');
beginShape();
vertex(839+17, 33+20+132);
bezierVertex(881.53+17, 33+20+132, 916+17, 92+20+132, 916+17, 165+20+132);
bezierVertex(916+17, 238+20+132, 881.53+17, 298+20+132, 839+17, 298+20+132);
bezierVertex(796.47+17, 298+20+132, 839+17, 238+20+132, 839+17, 165+20+132);
bezierVertex(839+17, 92+20+132, 796.47+17, 33+20+132, 839+17, 33+20+132);
endShape();
fill('#0D0836');
beginShape();
vertex(839, 33+132);
bezierVertex(881.53, 33+132, 916, 92+132, 916, 165+132);
bezierVertex(916, 238+132, 881.53, 298+132, 839, 298+132);
bezierVertex(796.47, 298+132, 839, 238+132, 839, 165+132);
bezierVertex(839, 92+132, 796.47, 33+132, 839, 33+132);
endShape();


let linearGradient2 = drawingContext.createLinearGradient(676, 357, 676, 420);
  linearGradient2.addColorStop(0, '#D8D8D8');
  linearGradient2.addColorStop(1, '#0A4C63');
  drawingContext.fillStyle = linearGradient2;
//물방울 왼
beginShape();
vertex(676, 357);
bezierVertex(676, 357,654, 385, 654, 397);
bezierVertex(654, 409, 664, 420, 676, 420);
bezierVertex(688, 420, 699, 409, 699, 397);
bezierVertex(699, 385,676, 357, 676, 357);
endShape();

let linearGradient3 = drawingContext.createLinearGradient(840, 63, 840, 126);
  linearGradient3.addColorStop(0, '#D8D8D8');
  linearGradient3.addColorStop(1, '#0A4C63');
  drawingContext.fillStyle = linearGradient3;
//물방울 오른
beginShape();
vertex(840, 63);
bezierVertex(840, 63, 818, 91, 818, 103);
bezierVertex(818, 115, 828, 126, 840, 126);
bezierVertex(852, 126, 863, 115, 863, 103);
bezierVertex(863, 91, 840, 63, 840, 63);
endShape();


//ANGER

fill(0);
rect(0, 500, 500);

let linearGradient4 = drawingContext.createLinearGradient(250, 500, 250, 750);
  linearGradient4.addColorStop(0, '#FF000055');
  linearGradient4.addColorStop(1, '#24030355');
  drawingContext.fillStyle = linearGradient4;
// 위쪽 원본
beginShape();
vertex(0, 500);
vertex(72, 749);
vertex(100, 620);
vertex(140, 749);
vertex(211, 531); 
vertex(241, 749);
vertex(274, 505);
vertex(320, 749);
vertex(355, 573);
vertex(387, 749);
vertex(433, 506);
vertex(466, 749);
vertex(500, 500);
endShape(CLOSE);

//위 미러
beginShape();
vertex(500, 500);
vertex(428, 749);
vertex(400, 620);
vertex(360, 749);
vertex(289, 531);
vertex(259, 749);
vertex(226, 505);
vertex(180, 749);
vertex(145, 573);
vertex(113, 749);
vertex(67, 506);
vertex(34, 749);
vertex(0, 500);
endShape(CLOSE);

let linearGradient5 = drawingContext.createLinearGradient(250, 750, 250, 1000);
  linearGradient5.addColorStop(0, '#24030355');
  linearGradient5.addColorStop(1, '#FF000055');
  drawingContext.fillStyle = linearGradient5;

//아래 원본
beginShape();
vertex(0, 1000); 
vertex(33, 750);
vertex(69, 990);
vertex(117, 750); 
vertex(160, 960);
vertex(190, 750); 
vertex(220, 970);
vertex(240, 750);
vertex(261, 982);
vertex(295, 750);
vertex(321, 926);
vertex(348, 750);
vertex(377, 943);
vertex(407, 750);
vertex(429, 906);
vertex(457, 750);
vertex(500, 1000);
endShape(CLOSE);


//아래 미러
beginShape();
vertex(500, 1000);
vertex(467, 750);
vertex(431, 990);
vertex(383, 750);
vertex(340, 960);
vertex(310, 750);
vertex(280, 970);
vertex(260, 750);
vertex(239, 982);
vertex(205, 750);
vertex(179, 926);
vertex(152, 750);
vertex(123, 943);
vertex(93, 750);
vertex(71, 906);
vertex(43, 750);
vertex(0, 1000);
endShape(CLOSE);

//FEAR

function gradientRect(x, y, w, h) {
  let cx = x + w/2;
  let cy = y + h/2;
  
  drawingContext.save();
  drawingContext.translate(cx, cy);
  drawingContext.scale(w/h, 1); // 가로를 rect 비율에 맞게 압축
  
  let grad = drawingContext.createRadialGradient(0, 0, 0, 0, 0, h/2);
  grad.addColorStop(0, '#000101');
  grad.addColorStop(1, '#8ADEE2');
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(-h/2, -h/2, h, h);
  
  drawingContext.restore();
}
//first row
gradientRect(500, 500, 46, 220);
gradientRect(546, 500, 46, 220);
gradientRect(592, 500, 105, 220);
gradientRect(697, 500, 222, 220);
gradientRect(697+222, 500, 42, 220);
gradientRect(697+222+42, 500, 42, 220);


//second row
gradientRect(500, 720, 46, 220);
gradientRect(546, 720, 179, 220);
gradientRect(725, 720, 85, 220);
gradientRect(725+85, 720, 13, 220);
gradientRect(725+85+13, 720, 13, 220);
gradientRect(725+85+13+13, 720, 13, 220);
gradientRect(725+85+13+13+13, 720, 13, 220);
gradientRect(725+85+13+13+13+13, 720, 30, 220);
gradientRect(725+85+13+13+13+13+30, 720, 30, 220);
gradientRect(725+85+13+13+13+13+30+30, 720, 30, 220);
gradientRect(725+85+13+13+13+13+30+30+30, 720, 51, 220);

//third row
gradientRect(500, 940, 167, 60);
gradientRect(500+167, 940, 82, 60);
gradientRect(500+167+82, 940, 13, 60);
gradientRect(500+167+82+13, 940, 13, 60);
gradientRect(500+167+82+13+13, 940, 13, 60);
gradientRect(500+167+82+13+13+13, 940, 13, 60);
gradientRect(500+167+82+13+13+13+13, 940, 30, 60);
gradientRect(500+167+82+13+13+13+13+30, 940, 30, 60);
gradientRect(500+167+82+13+13+13+13+30+30, 940, 30, 60);
gradientRect(500+167+82+13+13+13+13+30+30+30, 940, 13, 60);
gradientRect(500+167+82+13+13+13+13+30+30+30+13, 940, 13, 60);
gradientRect(500+167+82+13+13+13+13+30+30+30+13+13, 940, 30, 60);
gradientRect(500+167+82+13+13+13+13+30+30+30+13+13+30, 940, 30, 60);
gradientRect(500+167+82+13+13+13+13+30+30+30+13+13+30+30, 940, 23, 60);

fill(0, 0, 0, 135); 
ellipse(808 + 192/2, 720 + 156/2, 192, 156);
ellipse(808 + 192/2, 720 + 156 + 45/2, 192, 45);
ellipse(808 + 192/2, 720 + 156 + 45 + 19/2, 192, 19);

}
