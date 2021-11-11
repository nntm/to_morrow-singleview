let canvasDiv;
let canvas;

let thisModule;
let id = "hxk7";

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
          json.entries[i].instagram,
          json.entries[i].weather,
          json.entries[i].visualization
        );
      }
    }
  });
}

//--------------------------------------------------//

function createModule(index, id, isNew, pos, ins, wea, vis) {
  thisModule = new Module(index, id, isNew, pos, ins, wea, vis);
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

  //--------------------------------------------------//

  exportFrame() {
    //let DIR = "/assets/";
    //let logo = loadImage(DIR + "logo.png");
    //let font = loadFont(DIR + "Recursive_Monospace-Regular.ttf");
    //let prompt = loadImage(DIR + "prompt.png");

    let FRAME_WIDTH = 1200;
    //let FRAME_HEIGHT = 1500;
    let FRAME_HEIGHT = FRAME_WIDTH;
    let FRAME_MARGIN = 50;
    let FRAME_HEADING_MARGIN = 140;
    let MODULE_RATIO_TO_FRAME = 3;
    let TEXT_SIZE = 32;

    // Initialize frame
    this.frame = createGraphics(FRAME_WIDTH, FRAME_HEIGHT);
    this.frame.background(BLACK);

    // Display: Logo
    /*
    this.frame.imageMode(CORNER);
    this.frame.image(logo, FRAME_MARGIN, FRAME_MARGIN);
    */

    // Display: ID
    /*
    let outlook = "Outlook " + thisModule.id.toUpperCase();
    this.frame.textFont(font, TEXT_SIZE);
    this.frame.textAlign(LEFT, BOTTOM);
    this.frame.fill(WHITE);
    this.frame.text(outlook, FRAME_MARGIN, FRAME_HEADING_MARGIN);
    */

    // Display: Timestamp
    /*
    let timestamp = thisModule.timestamp;
    let formattedTimestamp =
      formattedDate(timestamp, "date", "/") +
      "\n" +
      formattedDate(timestamp, "time", ":") +
      " GMT+7";
    this.frame.textFont(font, TEXT_SIZE);
    this.frame.textAlign(RIGHT, BOTTOM);
    this.frame.fill(WHITE);
    this.frame.text(
      formattedTimestamp,
      FRAME_WIDTH - FRAME_MARGIN,
      FRAME_HEADING_MARGIN
    );
    */

    // Display: Prompt
    /*
    this.frame.imageMode(CENTER);
    this.frame.image(
      prompt,
      FRAME_WIDTH / 2,
      FRAME_HEIGHT - FRAME_MARGIN - logo.height
    );
    */

    // Display: module screenshot
    this.drawModuleToFrame(MODULE_RATIO_TO_FRAME, FRAME_WIDTH, FRAME_HEIGHT);

    // Export
    save(
      this.frame,
      "to_morrow" +
        " — " +
        "Outlook " +
        thisModule.id.toUpperCase() +
        " at " +
        formattedDate(Date.now(), "time", ".") +
        ".jpg"
    );
  }

  //--------------------------------------------------//

  drawModuleToFrame(ratio, frameWidth, frameHeight) {
    this.frame.blendMode(SCREEN);
    this.frame.strokeCap(SQUARE);

    this.frame.push();
    this.frame.translate(frameWidth / 2, frameHeight / 2);
    this.frame.rotate(frameCount * thisModule.rotationSpeed);

    // Petals
    for (let p of thisModule.petals) {
      for (let i = 0; i < MODULE_VERTEX_COUNT; i++) {
        this.frame.rotate(TWO_PI / MODULE_VERTEX_COUNT);

        this.frame.push();
        this.frame.translate((MODULE_RADIUS / 2) * ratio, 0);
        this.frame.rotate(p.petal_direction);

        this.frame.colorMode(RGB, 255, 255, 255, 1);
        this.frame.noStroke();
        this.frame.fill(red(p.color), green(p.color), blue(p.color), p.opacity);

        this.frame.push();
        this.frame.translate((p.x - MODULE_RADIUS / 2.0) * ratio, 0);
        this.frame.rotate(-frameCount * this.rotation);

        switch (p.shapeType) {
          case "SEMIELLIPSE":
            if (p.shapeIsOutward) {
              this.frame.arc(
                (p.width / 2) * ratio,
                0,
                p.width * 2 * ratio,
                p.height * ratio,
                HALF_PI,
                -HALF_PI
              );
            } else {
              this.frame.arc(
                (-p.width / 2) * ratio,
                0,
                p.width * 2 * ratio,
                p.height * ratio,
                -HALF_PI,
                HALF_PI
              );
            }
            break;
          case "ELLIPSE":
            this.frame.ellipseMode(CENTER);
            this.frame.ellipse(0, 0, p.width * ratio, p.height * ratio);
            break;
          case "TRIANGLE":
            if (p.shapeIsOutward) {
              this.frame.triangle(
                (-p.width / 2) * ratio,
                0,
                (p.width - p.width / 2) * ratio,
                (-p.height / 2) * ratio,
                (p.width - p.width / 2) * ratio,
                (p.height / 2) * ratio
              );
            } else {
              this.frame.triangle(
                (p.width - p.width / 2) * ratio,
                0,
                (-p.width / 2) * ratio,
                (-p.height / 2) * ratio,
                (-p.width / 2) * ratio,
                (p.height / 2) * ratio
              );
            }
            break;
          case "DIAMOND":
            this.frame.beginShape();
            this.frame.vertex((-p.width / 2) * ratio, 0);
            this.frame.vertex(0, (-p.height / 2) * ratio);
            this.frame.vertex((p.width - p.width / 2) * ratio, 0);
            this.frame.vertex(0, (p.height / 2) * ratio);
            this.frame.endShape(CLOSE);
            break;
        }

        this.frame.pop();

        this.frame.pop();
      }
    }

    // Rays
    for (let r of thisModule.rays) {
      this.frame.noFill();
      this.frame.stroke(r.color);
      this.frame.strokeWeight(r.strokeWeight * ratio);

      this.frame.push();
      this.frame.rotate(r.segment);

      this.frame.line(r.x1 * ratio, 0, r.x2 * ratio, 0);

      this.frame.pop();
    }

    // Arcs
    for (let a of thisModule.arcs) {
      this.frame.noFill();
      this.frame.stroke(red(a.color), green(a.color), blue(a.color), a.opacity);
      this.frame.strokeWeight(a.strokeWeight * ratio);

      if (a.isClockwise) {
        this.frame.arc(
          0,
          0,
          a.radius * 2 * ratio,
          a.radius * 2 * ratio,
          a.a2,
          a.a1
        );
      } else {
        this.frame.arc(
          0,
          0,
          a.radius * 2 * ratio,
          a.radius * 2 * ratio,
          a.a1,
          a.a2
        );
      }
    }

    // Droplets
    for (let d of thisModule.droplets) {
      this.frame.noFill();
      this.frame.stroke(red(d.color), green(d.color), blue(d.color), d.opacity);
      this.frame.strokeWeight(d.strokeWeight * ratio);

      this.frame.push();
      this.frame.rotate(d.segment);

      this.frame.ellipse(d.x * ratio, 0, d.radius * ratio);

      this.frame.pop();
    }

    this.frame.pop();
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
//--------------------------------------------------//
//--------------------------------------------------//

function draw() {
  background(BLACK);

  FPS_RELATIVE_SPEED = (FPS_DEFAULT * 1.0) / frameRate();

  if (thisModule != null) {
    push();
    translate(width / 2, height / 2);
    rotate(frameCount * thisModule.rotationSpeed);

    thisModule.run();
    thisModule.display();

    pop();
  }
}

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    noLoop();
    canvas.exportFrame();
    loop();
  }
}

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

const dd = (date) => {
  let a;
  a = JSON.stringify(new Date(date).getDate());

  return a < 10 ? `0${a}` : a;
};

// Month
const mm = (date) => {
  let a;
  a = JSON.stringify(new Date(date).getMonth() + 1);

  return a < 10 ? `0${a}` : a;
};

// Year
const yy = (date) => {
  let a;
  a = JSON.stringify(new Date(date).getFullYear()).substring(2, 4);

  return a < 10 ? `0${a}` : a;
};

// Hour
const h = (date) => {
  let a;
  a = JSON.stringify(new Date(date).getHours());

  return a < 10 ? `0${a}` : a;
};

// Minute
const m = (date) => {
  let a;
  a = JSON.stringify(new Date(date).getMinutes());

  return a < 10 ? `0${a}` : a;
};

// Second
const s = (date) => {
  let a;
  a = JSON.stringify(new Date(date).getSeconds());

  return a < 10 ? `0${a}` : a;
};

//--------------------------------------------------//

function formattedDate(date, format, separator) {
  // Day

  switch (format) {
    case "date":
      return dd(date) + separator + mm(date) + separator + yy(date);
      break;
    case "time":
      return h(date) + separator + m(date) + separator + s(date);
      break;
  }
}
