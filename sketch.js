let img,
    canvasPadding = 10,
    canvasH = 259*2,
    canvasW = 194*2,
    imgPixel;
let frameDotsCount = 200,
    frameRadius = canvasH > canvasW ? canvasW/2:canvasH/2,
    frameTheta, frameDotsVector=[],
    threadBrightness=50,
    threadMaxCount = 2000,
    threadCount = 0,
    threadEndIndex = -1,
    pins = [];

frameRadius = frameRadius-canvasPadding;



function preload(){
  img = loadImage("img.jpg");
}

function setup() {
  frameTheta = TWO_PI/frameDotsCount;
  
  createCanvas(canvasW *3 ,canvasH);
  // background(255, 204, 0);

  img.filter(GRAY);
  img.loadPixels();
  imgPixel = img.pixels;
  image(img,0,0,canvasW,canvasH);
  
  createFrame();
}

// create circular dotted frame
function createFrame(){
  stroke(10)
  let theta = 0
  for(let i=0;i<frameDotsCount;i++){
    x = canvasW/2 + (cos(theta)*frameRadius) 
    y = canvasH/2 + (sin(theta)*frameRadius) 
    dot = createVector(x,y)
    point(dot.x,dot.y)
    
    // store the vectors of all the pins
    frameDotsVector.push(
		{
			x: dot.x,
			y: dot.y,
			i: i
		}
	)
    theta += frameTheta
  }
  
  //pick a Random starting Pin
  threadStart = random(frameDotsVector)
}


function getNextPin(){
  let maxPixelShadeSum = -1,
      tempNextPin;
  
  // loop over all Pins and find highest Pixel Shade Sum
  for(let i=0;i<frameDotsVector.length;i++){
    // If pins are same
	// Or if pins are adj
	// then skip it
    if(threadStart.i === frameDotsVector[i].i || 
		threadStart.i - 1 === frameDotsVector[i].i ||
		threadStart.i + 1 === frameDotsVector[i].i){
      continue;
    }
    
    // if next pin is previous pin then skip it
    // if(threadPrev !== -1){
    //   if(threadPrev.x === frameDotsVector[i].x && 
    //      threadPrev.y === frameDotsVector[i].y){
    //     continue;
    //   }
    // }
    
    
    // calculate the sum of pixels between 2 pins
    let pixelShadeSum = getPixelShadeSumBtw2Pins(threadStart,frameDotsVector[i]);
    maxPixelShadeSum = maxPixelShadeSum > pixelShadeSum ?
                      maxPixelShadeSum : pixelShadeSum;
    
    // if max pixel shade sum has changed then it will be next Pin
    if(maxPixelShadeSum === pixelShadeSum){
      tempNextPin = frameDotsVector[i];
      threadNextIndex = i;
    }
  }
  
  // reduce the pixel data between 2 pins
  reducePixelShadeSumBtw2Pins(threadStart,tempNextPin)
  
  return tempNextPin;
}

// returns the sum of Pixel shade between 2 vector points
function getPixelShadeSumBtw2Pins(VectorA, VectorB){
  let dx = VectorB.x - VectorA.x,
      dy = VectorB.y - VectorA.y,
      steps = max(abs(dx), abs(dy)),
      sum = 0;
  for (let i = 0; i <= steps; i++) {
  let x = floor(VectorA.x + (i / steps) * dx),
      y = floor(VectorA.y + (i / steps) * dy);
    pixelData = get(x,y);
    //console.log(pixelData)
    sum += (255 - pixelData[0]) + (255 - pixelData[1]) + (255 - pixelData[2]) 
  } 
  return sum/steps;
}

function reducePixelShadeSumBtw2Pins(VectorA, VectorB){
  let dx = VectorB.x - VectorA.x,
      dy = VectorB.y - VectorA.y,
      steps = max(abs(dx), abs(dy)),
      sum = 0;
  for (let i = 0; i <= steps; i++) {
  let x = floor(VectorA.x + (i / steps) * dx),
      y = floor(VectorA.y + (i / steps) * dy)
    pixelData = get(x,y);
    let r = min(255, pixelData[0] + threadBrightness);
    let g = min(255, pixelData[1] + threadBrightness);
    let b = min(255, pixelData[2] + threadBrightness);
    set(x,y,[r,g,b,pixelData[3]])
    
    r = max(0, pixelData[0] - threadBrightness);
    g = max(0, pixelData[1] - threadBrightness);
    b = max(0, pixelData[2] - threadBrightness);
    set(x + canvasW,y,[r,g,b,pixelData[3]])
  } 
  updatePixels()
} 


function draw() {
  if(threadCount > threadMaxCount){
	  //return;
	  stroke(0,30)
	  strokeWeight(1);
	  console.log(pins);
	 for(let i = 1; i<pins.length; i++){
		  
		line(pins[i-1].x + canvasW+canvasW, pins[i-1].y, pins[i].x + canvasW+canvasW, pins[i].y)
	  }
	  noLoop();
    return;
  }
  threadEnd = getNextPin();
  pins.push(threadStart)
  threadCount++;
  // threadPrev = threadStart
  threadStart = threadEnd; 
  }
  
  
  /*
----- Coding Tutorial by Patt Vira ----- 
Name: String Art
Video Tutorial: https://youtu.be/qH7ZgQghKUU

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/
/*
let img; let canvasSize = 300; let margin = 10;
let imgPixels = [];

let nails = []; let nailCount = 200; let nailSize = 2;
let lineIndex = []; let maxLines = 10000;

function preload() {
  img = loadImage("img.jpg");
}

function setup() {
  createCanvas(canvasSize * 2, canvasSize);
  img.resize(canvasSize, canvasSize);
  img.filter(GRAY);
  img.loadPixels();
  imgPixels = img.pixels.slice();
  
  for (let i=0; i<nailCount; i++) {
    let angle = TWO_PI/nailCount * i;
    let r = canvasSize / 2 - margin;
    let x = canvasSize / 2 + r * cos(angle);
    let y = canvasSize / 2 + r * sin(angle);
    nails.push(createVector(x, y));
  }
  
  let startingIndex = floor(random(nailCount));
  lineIndex.push(startingIndex);
}

function draw() {
  background(255);
  image(img, canvasSize, 0);
  
  noFill();
  stroke(0, 30);
  strokeWeight(0.5);
  for (let i=0; i<nailCount; i++) {
    ellipse(nails[i].x, nails[i].y, nailSize, nailSize);
  }
  
  for (let i=1; i<lineIndex.length; i++) {
    let nail1 = nails[lineIndex[i-1]];
    let nail2 = nails[lineIndex[i]];
    line(nail1.x, nail1.y, nail2.x, nail2.y);
  }
  
  if (lineIndex.length < maxLines) {
    let currentNailIndex = lineIndex[lineIndex.length - 1];
    let nextNailIndex = findNextNailIndex(currentNailIndex);
    
    if (nextNailIndex !== null) {
      lineIndex.push(nextNailIndex);
      updateImage(currentNailIndex, nextNailIndex);
    } else {
      print("No valid nail found. Stopping");
      save(lineIndex, "threadPath.txt");
      noLoop();
    }
    
  } else {
    print("Max Lines Reached");
    save(lineIndex, "threadPath.txt");
    noLoop();
  }
  
}

function findNextNailIndex(currentIndex) {
  let nextIndex = null;
  let highestContrast = -1;
  
  for (let i=0; i<nails.length; i++) {
    if (i != currentIndex) {
      let contrast = evaluateContrast(currentIndex, i);
      if (contrast > highestContrast) {
        highestContrast = contrast;
        nextIndex = i;
      }
    }
  }
  
  if (nextIndex === null) {
    nextIndex = floor(random(nailCount));
    print("Finding random next index");
  }
  
  return nextIndex;
  
}

function evaluateContrast(i1, i2) {
  let totalContrast = 0;
  let nail1 = nails[i1];
  let nail2 = nails[i2];
  let steps = 100;

  for (let i=0; i<steps; i++) {
    let x = floor(lerp(nail1.x, nail2.x, i/steps));
    let y = floor(lerp(nail1.y, nail2.y, i/steps));
    
    if (x >= 0 && x < canvasSize && y >= 0 && y < canvasSize) {
      let pixelIndex = 4 * (y * canvasSize + x);
      let brightness = imgPixels[pixelIndex];
      totalContrast += (255 - brightness);
    }
  }
  
  return totalContrast / steps;
  
}

function updateImage(i1, i2) {
  let nail1 = nails[i1];
  let nail2 = nails[i2];
  let steps = 100; 
  let bright = 10;
  
  for (let i=0; i<steps; i++) {
    let x = floor(lerp(nail1.x, nail2.x, i/steps));
    let y = floor(lerp(nail1.y, nail2.y, i/steps));
    let pixelIndex = 4 * (y * canvasSize + x);
    
    if (pixelIndex >= 0 && pixelIndex < imgPixels.length - 3) {
      if (imgPixels[pixelIndex] < 255 - bright) {
        imgPixels[pixelIndex + 0] = imgPixels[pixelIndex] + bright;
        imgPixels[pixelIndex + 1] = imgPixels[pixelIndex] + bright;
        imgPixels[pixelIndex + 2] = imgPixels[pixelIndex] + bright;
      }
    }
  }
  
  img.pixels.set(imgPixels);
  img.updatePixels();
}



*/