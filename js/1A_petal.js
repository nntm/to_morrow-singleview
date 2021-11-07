class Petal {
  constructor(
    lifespan,
    lifespanRange,
    shapeType,
    opacity,
    maxSize,
    color,
    rotation,
    noiseSegmentLength
  ) {
    this.lifespan = round(
      random(lifespan * (1 - lifespanRange), lifespan * (1 + lifespanRange))
    );

    this.shapeType = shapeType;
    this.shapeIsOutward = round(random(1)) == 0 ? true : false;

    this.x = 0;

    this.color = color;
    this.opacity = opacity;

    this.maxSize = maxSize;

    this.isMovingOutward = round(random(1)) == 0 ? true : false;
    this.progress = this.isMovingOutward ? 0 : this.lifespan;

    this.isDead = false;

    this.noiseSegmentLength = noiseSegmentLength;
    this.seed = int(random(MAX_NOISE_SEED));

    this.rotation = rotation;
  }

  //--------------------------------------------------//

  update(noisePos) {
    noiseSeed(this.seed);

    this.x = map(this.progress, this.lifespan, 0, 0, 1) * MODULE_RADIUS;

    this.width =
      MODULE_RADIUS *
      sin(map(this.progress, this.lifespan, 0, 0, PI)) *
      map(
        noise(
          map(this.progress, this.lifespan, 0, 0, this.noiseSegmentLength),
          noisePos
        ),
        0,
        1,
        0,
        this.maxSize
      );

    this.height =
      MODULE_RADIUS *
      sin(map(this.progress, this.lifespan, 0, PI, 0)) *
      map(
        noise(
          noisePos,
          -map(this.progress, this.lifespan, 0, 0, this.noiseSegmentLength)
        ),
        0,
        1,
        0,
        this.maxSize
      );

    if (this.isMovingOutward) {
      this.progress += FPS_RELATIVE_SPEED;

      if (this.progress > this.lifespan) {
        this.isDead = true;
      }
    } else {
      this.progress -= FPS_RELATIVE_SPEED;

      if (--this.progress < 0) {
        this.isDead = true;
      }
    }
  }

  //--------------------------------------------------//

  display() {
    colorMode(RGB, 255, 255, 255, 1);
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.opacity);

    push();
    translate(this.x - MODULE_RADIUS / 2.0, 0);
    rotate(-frameCount * this.rotation);

    switch (this.shapeType) {
      case "SEMIELLIPSE":
        if (this.shapeIsOutward) {
          arc(
            this.width / 2,
            0,
            this.width * 2,
            this.height,
            HALF_PI,
            -HALF_PI
          );
        } else {
          arc(
            -this.width / 2,
            0,
            this.width * 2,
            this.height,
            -HALF_PI,
            HALF_PI
          );
        }
        break;
      case "ELLIPSE":
        ellipseMode(CENTER);
        ellipse(0, 0, this.width, this.height);
        break;
      case "TRIANGLE":
        if (this.shapeIsOutward) {
          triangle(
            -this.width / 2,
            0,
            this.width - this.width / 2,
            -this.height / 2,
            this.width - this.width / 2,
            this.height / 2
          );
        } else {
          triangle(
            this.width - this.width / 2,
            0,
            -this.width / 2,
            -this.height / 2,
            -this.width / 2,
            this.height / 2
          );
        }
        break;
      case "DIAMOND":
        beginShape();
        vertex(-this.width / 2, 0);
        vertex(this.width / 2 - this.width / 2, -this.height / 2);
        vertex(this.width - this.width / 2, 0);
        vertex(this.width / 2 - this.width / 2, this.height / 2);
        endShape(CLOSE);
        break;
    }

    pop();
  }
}
