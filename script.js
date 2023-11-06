let gridW = 50
let gridH = 30
let blockSizeTarget = 80
let clickedX
let clickedY
let state = [];

let dragFirstX
let dragFirstY

let preset = "allOff" // "allOff", "allOn", "alternating", "random"

let started = false

let clickSequence = []

let autoSolveActive = false

function setup() {
   createCanvas(windowWidth, windowHeight)
   if (preset == "allOff") {
      for (let i = 0; i < gridW; i++) {
         state[i] = [];
         for (let j = 0; j < gridH; j++) {
            state[i][j] = false;
         }
      }
   }
   if (preset == "allOn") {
      for (let i = 0; i < gridW; i++) {
         state[i] = [];
         for (let j = 0; j < gridH; j++) {
            state[i][j] = true;
         }
      }
   }
   if (preset == "alternating") {
      for (let i = 0; i < gridW; i++) {
         state[i] = [];
         for (let j = 0; j < gridH; j++) {
            state[i][j] = (i + j) % 2 == 0;
         }
      }
   }
   if (preset == "random") {
      for (let i = 0; i < gridW; i++) {
         state[i] = [];
         for (let j = 0; j < gridH; j++) {
            state[i][j] = false;
         }
      }
      for (let i = 0; i < gridW; i++) {
         for (let j = 0; j < gridH; j++) {
            if (Math.random() < 0.5) {
               autoFlip(i, j)
            };
         }
      }
   }
   blockSize = blockSizeTarget
   if(blockSize * gridH > height || blockSize * gridW > width) {
      blockSize = Math.floor(Math.min(height / gridH, width / gridW))
   }

   updateVis()
//   startGame()
}

let i1 = 0; 
let clickSequenceLength = 0

function autoSolve() {
   if (i1 < clickSequenceLength) {
      autoFlip(clickSequence[i1][0], clickSequence[i1][1])
      i1++
   }
   updateVis()
}

function draw() {
   if(autoSolveActive) autoSolve()
   if(started) return
   gridW = document.getElementById('width').value
   gridH = document.getElementById('height').value
   blockSizeTarget = document.getElementById('maxBlocksize').value
   preset = document.getElementById('mode').value
   setup()
}

function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [array[i], array[j]] = [array[j], array[i]];
   }
 }

//function keyPressed() {
//   shuffleArray(clickSequence)
//   clickSequenceLength = clickSequence.length
//   autoSolveActive = true
//}

function startGame() {
   started = true
   document.getElementById('menu').remove()
}

function updateVis() {
   background(30)
   strokeWeight(2)
   stroke(0)
   drawGame()
}

function drawGame() {
   for (let j = 0; j < gridH; j++) {
      for (let i = 0; i < gridW; i++) {
         switch (state[i][j]) {
            case (false):
               fill(255, 50, 50)
               break
            case (true):
               fill(50, 255, 50)
               break
            default:
               fill(255, 255, 50)
               break
         }
         placeSquare(i, j)
      }
   }
}

function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
   blockSize = blockSizeTarget
   if(blockSize * gridH > height || blockSize * gridW > width) {
      blockSize = Math.floor(Math.min(height / gridH, width / gridW))
   }
   updateVis()
}

function autoFlip(x,y) {
   state[x][y] = !state[x][y]
   clickSequence.push([x, y])
   if (x < 0 || x >= gridW || y < 0 || y >= gridH) return
   if (x > 0 && !isNaN(state[x - 1][y])) {
      state[x - 1][y] = !state[x - 1][y]
   }
   if (y > 0 && !isNaN(state[x][y - 1])) {
      state[x][y - 1] = !state[x][y - 1]
   }
   if (x < gridW - 1 && !isNaN(state[x + 1][y])) {
      state[x + 1][y] = !state[x + 1][y]
   }
   if (y < gridH - 1 && !isNaN(state[x][y + 1])) {
      state[x][y + 1] = !state[x][y + 1]
   }
}

function mousePressed() {
   if (!started) return
   clickedX = Math.floor((mouseX - (width - gridW * blockSize) / 2) / blockSize)
   clickedY = Math.floor((mouseY - (height - gridH * blockSize) / 2) / blockSize)
   if (clickedX < 0 || clickedX >= gridW || clickedY < 0 || clickedY >= gridH) return
   state[clickedX][clickedY] = !state[clickedX][clickedY]
   dragFirstX = clickedX
   dragFirstY = clickedY
   clickSequence.push([clickedX, clickedY])
   updateVis()
}

function mouseReleased() {
   if (!started) return
   if (clickedX < 0 || clickedX >= gridW || clickedY < 0 || clickedY >= gridH) return
   if (clickedX > 0 && !isNaN(state[clickedX - 1][clickedY])) {
      state[clickedX - 1][clickedY] = !state[clickedX - 1][clickedY]
   }
   if (clickedY > 0 && !isNaN(state[clickedX][clickedY - 1])) {
      state[clickedX][clickedY - 1] = !state[clickedX][clickedY - 1]
   }
   if (clickedX < gridW - 1 && !isNaN(state[clickedX + 1][clickedY])) {
      state[clickedX + 1][clickedY] = !state[clickedX + 1][clickedY]
   }
   if (clickedY < gridH - 1 && !isNaN(state[clickedX][clickedY + 1])) {
      state[clickedX][clickedY + 1] = !state[clickedX][clickedY + 1]
   }
   updateVis()
}

function mouseDragged() {
   if (!started) return
   if (Math.floor((mouseX - (width - gridW * blockSize) / 2) / blockSize) !== dragFirstX || Math.floor((mouseY - (height - gridH * blockSize) / 2) / blockSize) !== dragFirstY) {
      mouseReleased()
      mousePressed()
      
   }
}

function placeSquare(x, y) {
   square(x * blockSize + (width - gridW * blockSize) / 2, y * blockSize + (height - gridH * blockSize) / 2, blockSize)
}
