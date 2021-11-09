let canvasDiv;
let canvas;

let thisModule;
let id = "of2l";

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

let JSON_URL =
  "http://ec2-52-221-184-232.ap-southeast-1.compute.amazonaws.com:8080//vfcd21/v1/processed-data";

//--------------------------------------------------//

function getModuleByID(id) {
  loadJSON(JSON_URL, function (json) {
    for (let i = 0; i < json.entries.length; i++) {
      if (json.entries[i].id === id) {
        createModule(
          0,
          json.entries[i].id,
          true,
          createVector(0, 0),
          json.entries[i].visualization
        );
      }
    }
  });
}

//--------------------------------------------------//

function createModule(index, id, isNew, pos, vis) {
  thisModule = new Module(index, id, isNew, pos, vis);
  console.log(thisModule);
}

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

class ModuleCanvas {
  constructor(width, height, parentID) {
    this.width = width;
    this.height = height;

    this.parentID = parentID;

    this.canvas = createCanvas(this.width, this.height);
    this.canvas.parent(parentID);

    this.maxZoomLvl = 1;
    this.minZoomLvl = 0;
    this.currentZoomLvl = 0;
  }

  resize(width, height) {
    resizeCanvas(windowWidth, windowHeight);
  }
}

//--------------------------------------------------//

function setup() {
  canvasDiv = document.getElementById("single-view-wrapper");

  canvas = new ModuleCanvas(
    canvasDiv.offsetWidth,
    canvasDiv.offsetHeight,
    "single-view-wrapper"
  );

  frameRate(FPS_DEFAULT);
  FPS_RELATIVE_SPEED = 1;

  rectMode(CENTER);
  ellipseMode(CENTER);

  strokeCap(SQUARE);

  getModuleByID(id);

  MODULE_RADIUS = canvasDiv.offsetWidth * MODULE_RATIO_TO_CANVAS;
}

//--------------------------------------------------//

function calcSizes() {}

//--------------------------------------------------//

function windowResized() {
  canvas.resize(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
}

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

function draw() {
  background(0);

  FPS_SPEED = (FPS_DEFAULT * 1.0) / frameRate();

  if (thisModule != null) {
    push();
    translate(width / 2, height / 2);

    push();
    rotate(frameCount * thisModule.rotationSpeed);

    thisModule.run();
    thisModule.display();

    pop();
  }
}
