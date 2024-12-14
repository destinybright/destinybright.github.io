const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Constraint } = Matter;

// Create engine and world
const engine = Engine.create();
const world = engine.world;

// Set up the canvas
const canvas = document.getElementById('matterCanvas');
canvas.style.width = '100%'; // Set canvas width to 100%
canvas.width = window.innerWidth; // Set canvas width to window width

// Fixed parameters
const cradleSize = 40; // Fixed size of the balls (radius)
const numberOfBalls = 5;
const separation = 1.95; // Separation factor for spacing the balls
const cradleLength = 250; // Fixed length of the strings (lines)
const cradleY = 0; // Top Y position of the cradle (top of the canvas)

// Calculate canvas height based on cradle
const canvasHeight = cradleLength + cradleSize + 20; // Line length + ball size + 20px gap
canvas.style.height = `${canvasHeight}px`; // Set canvas height to calculated value
canvas.height = canvasHeight; // Set canvas height

// Create a renderer
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
        background: 'transparent', // Set background to transparent
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Create a thin and transparent ground
const ground = Bodies.rectangle(canvas.width / 2, canvas.height - 5, canvas.width, 10, {
    isStatic: true,
    render: {
        fillStyle: 'transparent', // Set fillStyle to transparent
        strokeStyle: 'transparent' // Optionally set strokeStyle to transparent as well
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
            pointA: { x: circleX, y: yy }, // Fixed point at the top (y: 0)
            bodyB: circle,
            stiffness: 1, // Stiffness set to 1 to prevent stretching
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

// Add mouse control
const mouse = Mouse.create(render.canvas, {
    pixelRatio: render.options.pixelRatio,
    // Enable touch scrolling
    allowTouchScrolling: true
});

const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false // Don't show the dragging constraint line
        }
    }
});

Composite.add(world, mouseConstraint);

// Function to reposition the cradle when resizing
function repositionCradle() {
    // Update canvas width
    canvas.width = window.innerWidth;
    render.options.width = canvas.width;
    render.canvas.width = canvas.width;

    // Recalculate the starting X position of the cradle to keep it centered
    cradleX = calculateCradlePosition(numberOfBalls, cradleSize, separation);

    for (let i = 0; i < newtonsCradle.bodies.length; i++) {
        const circleX = cradleX + i * (cradleSize * separation);
        const circleY = cradleY + cradleLength;

        // Reposition balls to maintain fixed vertical position
        Matter.Body.setPosition(newtonsCradle.bodies[i], {
            x: circleX,
            y: circleY
        });

        // Update the constraints
        newtonsCradle.constraints[i].pointA.x = circleX;
        newtonsCradle.constraints[i].pointA.y = cradleY; // Ensure the constraint point is at the top (y: 0)
        // Constraints length remains fixed
    }

    // Adjust ground position
    Matter.Body.setPosition(ground, { x: canvas.width / 2, y: canvas.height - 5 });
    ground.bounds.min.x = 0;
    ground.bounds.max.x = canvas.width;
}

// Keep the canvas and physics bodies responsive to window resizing
window.addEventListener('resize', repositionCradle);

// Initial setup
repositionCradle();
