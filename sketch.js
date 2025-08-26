const { Engine, Render, Runner, Bodies, Composite, Events, Body } = Matter;

const engine = Engine.create();
const world = engine.world;

const canvas = document.getElementById('matterCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = '100%';
canvas.style.height = `${canvas.height}px`;

const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: canvas.width,
    height: canvas.height,
    wireframes: false,
    background: 'transparent'
  }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Cybercore colors
const cyberColors = [
  '#e0f7ff', '#b3e5fc', '#cceeff', '#f0f8ff', '#d0f0ff',
  '#e6faff', '#d9ecff', '#b0c4de', '#e0e0e0', '#ffffff'
];

// Star shape
function createStarVertices(cx, cy, outerRadius, innerRadius, points = 5) {
  const angle = Math.PI / points;
  const vertices = [];
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const a = i * angle;
    vertices.push({
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a)
    });
  }
  return vertices;
}

// Trail effects
let trailParticles = [];

function spawnTrail(x, y, color) {
  trailParticles.push({
    x,
    y,
    alpha: 1,
    color,
    size: 3 + Math.random() * 2
  });
}

function drawTrails(ctx) {
  for (let i = trailParticles.length - 1; i >= 0; i--) {
    const p = trailParticles[i];
    ctx.beginPath();
    ctx.fillStyle = `${p.color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
    ctx.fill();

    p.alpha -= 0.02;
    if (p.alpha <= 0) {
      trailParticles.splice(i, 1);
    }
  }
}

// Spawn a star
function spawnCyberStar() {
  const x = Math.random() * canvas.width;
  const outerR = 28 + Math.random() * 6;
  const innerR = outerR * 0.45;
  const starVerts = createStarVertices(0, 0, outerR, innerR, 5);
  const color = cyberColors[Math.floor(Math.random() * cyberColors.length)];

  const star = Bodies.fromVertices(x, -30, starVerts, {
    restitution: 0.5,
    frictionAir: 0.01,
    render: {
      fillStyle: color,
      strokeStyle: '#ffffff',
      lineWidth: 1,
      shadowColor: color,
      shadowBlur: 25,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    }
  }, true);

  star.customColor = color;

  Body.setAngularVelocity(star, 0.03 + Math.random() * 0.04);
  Composite.add(world, star);
}

// Star trail effect
Events.on(engine, 'afterUpdate', () => {
  const bodies = Composite.allBodies(world);
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];
    if (body.position.y > canvas.height + 100) {
      Composite.remove(world, body);
    } else if (body.customColor && Math.random() < 0.4) {
      spawnTrail(body.position.x, body.position.y, body.customColor);
    }
  }
});

// Animate trails
(function trailLoop() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTrails(ctx);
  requestAnimationFrame(trailLoop);
})();

// Star spawn timer
setInterval(spawnCyberStar, 200);

// Resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render.canvas.width = canvas.width;
  render.canvas.height = canvas.height;
});
