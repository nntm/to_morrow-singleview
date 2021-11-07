class Ray {
  constructor(lifespan, lifespanRange, length, color, segment, strokeWeight) {
    this.isMovingOutward = true;

    this.lifespan1 = round(
      random(lifespan * (1 - lifespanRange), lifespan * (1 + lifespanRange))
    );
    this.progress1 = this.isMovingOutward ? 0 : this.lifespan1;

    this.lifespan2 = round(
      random(lifespan * (1 - lifespanRange), lifespan * (1 + lifespanRange))
    );
    this.progress2 = this.isMovingOutward ? 0 : this.lifespan2;

    this.color = color;
    this.segment = segment;

    this.isLongest = false;
    this.isDead = false;

    this.length = length * MODULE_RADIUS;
    this.root = random(0, MODULE_RADIUS - this.length);

    this.strokeWeight = strokeWeight * MODULE_RADIUS;
  }

  //--------------------------------------------------//

  update() {
    this.x1 = map(
      this.progress1,
      0,
      this.lifespan1,
      this.root,
      this.root + this.length
    );
    this.x2 = map(
      this.progress2,
      0,
      this.lifespan2,
      this.root,
      this.root + this.length
    );

    if (!this.isLongest) {
      this.progress1 += FPS_RELATIVE_SPEED;
      this.isLongest = this.progress1 >= this.lifespan1;
    } else {
      this.progress2 += FPS_RELATIVE_SPEED;
    }

    if (this.isLongest && this.progress2 >= this.lifespan2) {
      this.isDead = true;
    }
  }

  //--------------------------------------------------//

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(this.strokeWeight);

    push();
    rotate(this.segment);

    line(this.x1, 0, this.x2, 0);

    pop();
  }
}
