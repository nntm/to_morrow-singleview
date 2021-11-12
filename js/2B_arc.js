class Arc {
    constructor(
        lifespan,
        lifespanRange,
        opacity,
        color,
        segment,
        span,
        isClockwise,
        strokeWeight
    ) {
        this.isClockwise = isClockwise;

        this.lifespan1 = round(
            random(lifespan - lifespanRange, lifespan + lifespanRange)
        );
        this.progress1 = this.isClockwise ? 0 : this.lifespan1;

        this.lifespan2 = round(
            random(lifespan - lifespanRange, lifespan + lifespanRange)
        );
        this.progress2 = this.isClockwise ? 0 : this.lifespan2;

        this.span = map(span, 0, 1, 0, TWO_PI);

        this.begin = segment;
        if (this.isClockwise) {
            this.end = this.begin + this.span;
        } else {
            this.end = this.begin - this.span;
        }

        this.opacity = opacity;
        this.color = color;

        this.isLongest = false;
        this.isDead = false;

        this.strokeWeight = strokeWeight * MODULE_RADIUS;

        this.radius = 0;

        this.a1 = 0;
        this.a2 = 0;

        this.isMovingOutward = round(random(1)) == 0 ? true : false;
    }

    //--------------------------------------------------//

    update() {
        if (this.isClockwise) {
            this.a1 = map(
                this.progress1,
                0,
                this.lifespan1,
                this.begin,
                this.end
            );
            this.a2 = map(
                this.progress2,
                0,
                this.lifespan2,
                this.begin,
                this.end
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
        } else {
            this.a1 = map(
                this.progress1,
                0,
                this.lifespan1,
                this.end,
                this.begin
            );
            this.a2 = map(
                this.progress2,
                0,
                this.lifespan2,
                this.end,
                this.begin
            );

            if (!this.isLongest) {
                this.progress1 -= FPS_RELATIVE_SPEED;
                this.isLongest = this.progress1 <= 0;
            } else {
                this.progress2--;
            }

            if (this.isLongest && this.progress2 <= 0) {
                this.isDead = true;
            }
        }

        if (this.isMovingOutward) {
            this.radius = map(
                this.progress1 + this.progress2,
                0,
                this.lifespan1 + this.lifespan2,
                0,
                MODULE_RADIUS
            );
        } else {
            this.radius = map(
                this.progress1 + this.progress2,
                0,
                this.lifespan1 + this.lifespan2,
                MODULE_RADIUS,
                0
            );
        }
    }

    //--------------------------------------------------//

    display() {
        noFill();
        stroke(
            red(this.color),
            green(this.color),
            blue(this.color),
            this.opacity
        );
        strokeWeight(this.strokeWeight);

        if (this.isClockwise) {
            arc(0, 0, this.radius * 2, this.radius * 2, this.a2, this.a1);
        } else {
            arc(0, 0, this.radius * 2, this.radius * 2, this.a1, this.a2);
        }
    }
}
