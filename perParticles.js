let minNodeSize = 1;
let maxNodeSize = 3;
let minVelocity = 0.25;
let maxVelocity = 2;
let nodesAmount = 1000;
let backgroundColor = '#222222';
let nodeColor = '#D1C4E9';
let lineColor = '#CE93D8';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = document.body.clientWidth;
ctx.canvas.height = window.innerHeight;
if (ctx.canvas.width > 5120) {
  ctx.canvas.width = 5120;
}

let nodes = [];
let lines = [];
let daemonsWorking = 0;
let timestamp = Date.now();

const updateDaemon = new Worker('updateDaemon.js');
const bucketDaemons = [
  new Worker('bucketDaemon.js'),
  new Worker('bucketDaemon.js'),
  new Worker('bucketDaemon.js'),
  new Worker('bucketDaemon.js'),
  new Worker('bucketDaemon.js')
];

const update = () => {
  document.querySelector('.nodeCount').textContent = `${nodes.length} nodes`;
  lines = [];
  updateDaemon.postMessage({
    command: 'update',
    nodes,
    options: {
      minNodeSize,
      maxNodeSize,
      minVelocity,
      maxVelocity,
      nodesAmount,
      width: ctx.canvas.width,
      height: ctx.canvas.height
    }
  });
};

const processBuckets = e => {
  nodes = e.data.nodes;
  e.data.buckets.forEach((bucket, index) => {
    daemonsWorking += 1;
    bucketDaemons[index].postMessage({ command: 'process', bucket });
  });
};

const gatherLines = e => {
  lines = [...lines, ...e.data.lines];
  daemonsWorking -= 1;

  if (daemonsWorking === 0) {
    draw();
  }
};

const draw = e => {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  lines.forEach(line => {
    const { n1, n2, distance } = line;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 50 / distance < 0.2 ? 50 / distance : 0.2;
    ctx.beginPath();
    ctx.moveTo(n1.x, n1.y);
    ctx.lineTo(n2.x, n2.y);
    ctx.stroke();
    ctx.lineWidth = 0.1;
  });

  nodes.forEach(node => {
    ctx.strokeStyle = nodeColor;
    ctx.fillStyle = nodeColor;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  });

  requestAnimationFrame(update);
};

updateDaemon.addEventListener('message', processBuckets);

bucketDaemons.forEach(daemon => {
  daemon.addEventListener('message', gatherLines);
});

window.addEventListener('resize', () => {
  ctx.canvas.width = document.body.clientWidth;
  ctx.canvas.height = window.innerHeight;
  if (ctx.canvas.width > 5120) {
    ctx.canvas.width = 5120;
  }
});

window.addEventListener('unload', () => {
  updateDaemon.postMessage({ command: 'stop' });
  bucketDaemons.forEach(daemon => daemon.postMessage({ command: 'stop' }));
});

const stats = new Stats();
const nodeCount = document.createElement('div');
nodeCount.classList.add('nodeCount');
stats.dom.appendChild(nodeCount);
stats.dom.style.margin = '5px';
stats.dom.style.pointerEvents = 'none';
document.body.appendChild(stats.dom);
requestAnimationFrame(function loop() {
  stats.update();
  requestAnimationFrame(loop);
});

update();