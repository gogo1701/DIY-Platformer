setCanvasSize(1200, 600);

let myX = 175,
  myY = 420,
  myW = 50,
  myH = 60,
  myDX = 0,
  myDY = 0;

let wX = [100],
  wY = [500],
  wW = [200],
  wH = [100];

let maxSpeed = 5,
  uskorenie = 0.5,
  namalenie = 1.1;

let isEditModeOn = true;
let maxNumberOfBoxes = Infinity;
let remainingBoxes = maxNumberOfBoxes;

function toggleBetweenMode() {
  if (isEditModeOn) {
    isEditModeOn = false;
  } else {
    isEditModeOn = true;
    myX = 175;
    myY = 420;
    myDX = 0;
    myDY = 0;
  }
}
function addNewBlock(posX, posY) {
  wX.push(posX);
  wY.push(posY);
  wW.push(50);
  wH.push(50);
}
function update() {
  document.getElementById("boxesText").textContent =
    "Remaining boxes: " + remainingBoxes;
  if (!isEditModeOn) {
    if (myDX >= -maxSpeed && myDX <= maxSpeed) {
      if (isKeyPressed[key_left]) {
        myDX -= uskorenie;
      } else if (isKeyPressed[key_right]) {
        myDX += uskorenie;
      } else {
        myDX /= namalenie;
      }
    } else {
      if (myDX < -maxSpeed) {
        myDX = -maxSpeed;
      } else if (myDX > maxSpeed) {
        myDX = maxSpeed;
      }
    }
    myDY += 0.05;
    myX += myDX;
    myY += myDY;

    for (let i = 0; i < wX.length; i++) {
      if (
        areColliding(
          myX + 5,
          myY + myH,
          myW - 10,
          1,
          wX[i],
          wY[i],
          wW[i],
          wH[i]
        )
      ) {
        myY -= myDY;
        myDY = 0;

        console.log("Ударихме се отгоре на стената");
      }

      // Проверка за колизия между ггорната черта и стената
      // 1. Горната черта за колизия е по-малка от горната част на играча
      // Когато горната черта се удари със стената,
      // знаем че играчът се е ударил със долната част на стената
      if (areColliding(myX + 5, myY, myW - 10, 1, wX[i], wY[i], wW[i], wH[i])) {
        myY -= myDY;
        myDY = 0;
        console.log("Ударихме се отдолу на стената");
      }

      // Аналогично на горната и долната черта за колизия,
      // лявата и дясната са по-малки от височината на играча
      if (areColliding(myX, myY + 5, 1, myH - 10, wX[i], wY[i], wW[i], wH[i])) {
        myX -= myDX;
        myDX = 0;
        console.log("Ударихме се отдясно на стената");
      }
      if (
        areColliding(
          myX + myW,
          myY + 5,
          1,
          myH - 10,
          wX[i],
          wY[i],
          wW[i],
          wH[i]
        )
      ) {
        myX -= myDX;
        myDX = 0;
        console.log("Ударихме се отляво на стената");
      }
    }
  }
  document.querySelectorAll("button").forEach(function (item) {
    item.addEventListener("focus", function () {
      this.blur();
    });
  });
}
function draw() {
  for (let i = 0; i < wX.length; i++) {
    context.fillRect(wX[i], wY[i], wW[i], wH[i]);
  }
  drawLine(0, 5, 1200, 5);
  drawImage(tryToLoad("femaleAction", "red"), myX, myY, myW, myH);
  context.fillRect(myX, 10, 10, 20);

  drawLine(
    myX + myW / 2,
    myY + myH / 2,
    myX + myW / 2 + myDX * 5,
    myY + myH / 2 + myDY * 5
  );
}

function keyup(key) {
  // Ако натиснем SPACE - скачаме нагоре
  if (key == 32 && myDY == 0) {
    myDY = -3;
  }
}

function mouseup() {
  if (isEditModeOn && remainingBoxes > 0) {
    if (!areColliding(mouseX, mouseY, 1, 1, 0, 600, 10000, 500)) {
      addNewBlock(mouseX - 25, mouseY - 25);
      remainingBoxes = remainingBoxes - 1;
      document.getElementById("boxesText").textContent =
        "Remaining boxes: " + remainingBoxes;
    }
  }
}
