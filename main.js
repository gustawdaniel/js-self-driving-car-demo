const carCanvas = document
    .querySelector('canvas#carCanvas');
carCanvas.width = 200;
const carCtx = carCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);


const car = new Car(100, 500, 30, 50);

const traffic = [];

animate()

function animate() {
    carCanvas.height = window.innerHeight;

    car.update(road.borders, traffic);

    road.draw(carCtx);

    car.draw(carCtx, 'red', true);

    requestAnimationFrame(animate)
}
