class Droplet {
    constructor(
        lifespan,
        lifespanRange,
        color,
        segment,
        opacity,
        maxStrokeWeight,
        maxRadius
    ) {
        this.lifespan = round(
            random(lifespan - lifespanRange, lifespan + lifespanRange)
        );
        this.progress = 0;

        this.color = color;
        this.opacity = opacity;

        this.isDead = false;

        this.maxStrokeWeight = maxStrokeWeight * MODULE_RADIUS;
        this.strokeWeight = this.maxStrokeWeight;

        this.maxRadius = maxRadius * MODULE_RADIUS;
        this.minRadius = this.maxRadius * 0.25;
        this.radius = 0;

        this.x = random(MODULE_RADIUS - this.maxRadius / 2);
        this.segment = segment;
    }

    //--------------------------------------------------//

    update() {
        this.radius = map(
            this.progress,
            0,
            this.lifespan,
            this.minRadius,
            this.maxRadius
        );

        this.strokeWeight = map(
            this.progress,
            0,
            this.lifespan,
            this.maxStrokeWeight,
            0
        );

        this.progress += FPS_RELATIVE_SPEED;

        if (this.progress > this.lifespan) {
            this.isDead = true;
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

        push();
        rotate(this.segment);

        ellipse(this.x, 0, this.radius);

        pop();
    }
}
