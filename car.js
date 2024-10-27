class Car {
    constructor(x,y,width,height, controlType, maxSpeed = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.controlls = new Controls();

        if (controlType !== 'DUMMY') {
            this.sensor = new Sensor(this);
        }
        this.controlls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic)
        }

        if(this.sensor) {
            this.sensor.update(roadBorders, traffic);

        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }


    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x + Math.sin(this.angle - alpha) * rad,
            y: this.y + Math.cos(this.angle- alpha) * rad
        });
        points.push({
            x: this.x + Math.sin(this.angle + alpha) * rad,
            y: this.y + Math.cos(this.angle+ alpha) * rad
        });
        points.push({
            x: this.x + Math.sin(Math.PI +this.angle - alpha) * rad,
            y: this.y + Math.cos(Math.PI +this.angle- alpha) * rad
        });
        points.push({
            x: this.x + Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y + Math.cos(Math.PI +this.angle+ alpha) * rad
        });
        return points;
    }

    #move() {
        if(this.controlls.forward) {
            this.speed += this.acceleration;
        }
        if(this.controlls.reverse){
            this.speed -= this.acceleration;
        }
        if(this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if(this.speed > 0) {
            this.speed -= this.friction;
        }
        if(this.speed < 0) {
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if(this.speed !== 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if(this.controlls.left) {
                this.angle += 0.03 * flip;
            }
            if(this.controlls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx, color,drawSensors = false) {
        if (this.damaged) {
            ctx.fillStyle = 'gray'
        } else {
            ctx.fillStyle = color
        }

        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.strokeStyle = 'transparent';
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        ctx.stroke();

        if (this.sensor && drawSensors) {
            this.sensor.draw(ctx);
        }
    }
}