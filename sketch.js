const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Constraint } = Matter;

const engine = Engine.create();
const world = engine.world;

const canvas = document.getElementById('matterCanvas');
canvas.style.width = '100%';
canvas.width = window.innerWidth;

const cradleSize = 40;
const numberOfBalls = 5;
const separation = 1.95;
const cradleLength = 250;
const cradleY = 0;

const canvasHeight = cradleLength + cradleSize + 20;
canvas.style.height = `${canvasHeight}px`;
canvas.height = canvasHeight;


const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
        background: 'transparent',
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

const ground = Bodies.rectangle(canvas.width / 2, canvas.height - 5, canvas.width, 10, {
    isStatic: true,
    render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent'
    }
});

// Function to create a Newton's Cradle
function createNewtonsCradle(xx, yy, number, size, length) {
    const cradle = Composite.create({ label: 'Newtons Cradle' });

    // Define an array of colors
    const colors = [
        '#4e6a6c', // Color for ball 1
        '#959D90', // Color for ball 2
        '#D1EBDB', // Color for ball 3
        '#D0D5CE', // Color for ball 4
        '#EFECE9'  // Color for ball 5
    ];

    for (let i = 0; i < number; i++) {
        const circleX = xx + i * (size * separation);
        const circleY = yy + length;

        const circle = Bodies.circle(circleX, circleY, size, {
            inertia: Infinity,
            restitution: 1,
            friction: 0,
            density: 1,
            frictionStatic: 0,
            frictionAir: 0,
            slop: size * 0.02,
            render: {
                fillStyle: colors[i % colors.length], // Assign a different color to each ball
            }
        });

        const constraint = Constraint.create({
            pointA: { x: circleX, y: yy },
            bodyB: circle,
            stiffness: 1,
            length: length,
            render: {
                strokeStyle: '#FFF',
                lineWidth: 1
            }
        });

        Composite.addBody(cradle, circle);
        Composite.addConstraint(cradle, constraint);
    }

    return cradle;
}

// Function to calculate initial position to center the cradle horizontally
function calculateCradlePosition(number, size, separation) {
    const totalWidth = (number - 1) * (size * separation);
    return (canvas.width - totalWidth) / 2;
}

// Initial cradle setup
let cradleX = calculateCradlePosition(numberOfBalls, cradleSize, separation);
let newtonsCradle = createNewtonsCradle(cradleX, cradleY, numberOfBalls, cradleSize, cradleLength);

// Add the ground and Newton's Cradle to the world
Composite.add(world, [ground, newtonsCradle]);

const mouse = Mouse.create(render.canvas, {
    pixelRatio: render.options.pixelRatio,
    allowTouchScrolling: true
});

const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(world, mouseConstraint);

function repositionCradle() {
    canvas.width = window.innerWidth;
    render.options.width = canvas.width;
    render.canvas.width = canvas.width;

    cradleX = calculateCradlePosition(numberOfBalls, cradleSize, separation);

    for (let i = 0; i < newtonsCradle.bodies.length; i++) {
        const circleX = cradleX + i * (cradleSize * separation);
        const circleY = cradleY + cradleLength;

        Matter.Body.setPosition(newtonsCradle.bodies[i], {
            x: circleX,
            y: circleY
        });

        newtonsCradle.constraints[i].pointA.x = circleX;
        newtonsCradle.constraints[i].pointA.y = cradleY;
    }

    Matter.Body.setPosition(ground, { x: canvas.width / 2, y: canvas.height - 5 });
    ground.bounds.min.x = 0;
    ground.bounds.max.x = canvas.width;
}

window.addEventListener('resize', repositionCradle);

repositionCradle();
