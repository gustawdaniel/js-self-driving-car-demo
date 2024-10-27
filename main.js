const carCanvas = document
    .querySelector('canvas#carCanvas');
carCanvas.width = 200;
const carCtx = carCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);


const car = new Car(100, 500, 30, 50, 'KEYS');

const traffic = [
    new Car(road.getLaneCenter(1), 300, 30,50,"DUMMY", 0.26),
    new Car(road.getLaneCenter(0), 100, 30,50,"DUMMY", 0.26),
    new Car(road.getLaneCenter(3), 100, 30,50,"DUMMY", 0.26),
];

animate()

function animate() {
    carCanvas.height = window.innerHeight;

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }

    car.update(road.borders, traffic);

    carCtx.save();
    carCtx.translate(0, -car.y+ carCanvas.height*0.7);

    road.draw(carCtx);

    for(let i = 0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }
    car.draw(carCtx, 'blue', true);

    carCtx.restore();


    requestAnimationFrame(animate)
}
