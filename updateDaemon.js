

const createNode = options => {
  const {
    minNodeSize,
    maxNodeSize,
    minVelocity,
    maxVelocity,
    width,
    height
  } = options;

  const nodeX = Math.floor(Math.random() * (width + 100) - 50);
  const nodeY = Math.floor(Math.random() * (height + 100) - 50);
  const nodeVelocityX = (Math.random() * maxVelocity + minVelocity) * (Math.round(Math.random()) ? 1 : -1);
  const nodeVelocityY = (Math.random() * maxVelocity + minVelocity) * (Math.round(Math.random()) ? 1 : -1);
  const nodeRadius = Math.floor(Math.random() * maxNodeSize + minNodeSize);
  return { x: nodeX, y: nodeY, r: nodeRadius, vx: nodeVelocityX, vy: nodeVelocityY };
};

self.addEventListener('message', e => {
  const { command, nodes, options } = e.data;

  switch (command) {
    case 'update':
      const { nodesAmount, maxVelocity, minVelocity, width, height } = options;

      while (nodes.length < nodesAmount) {
        nodes.push(createNode(options));
      }

      if (nodes.length > nodesAmount) {
        nodes.length = nodesAmount;
      }

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
        if ((nodes[i].x < -25 || nodes[i].x > width + 25) || (nodes[i].y < -25 || nodes[i].y > height + 25)) {
          nodes[i].vx = (Math.random() * maxVelocity + minVelocity) * (nodes[i].vx < 0 ? 1 : -1);
          nodes[i].vy = (Math.random() * maxVelocity + minVelocity) * (nodes[i].vy < 0 ? 1 : -1);
        }
      }

      const buckets = [];
      const numberOfBuckets = 5;
      const bucketWidth = Math.ceil(width / numberOfBuckets);

      for (let i = 0; i < numberOfBuckets; i++) {
        buckets.push({ x: i * bucketWidth - 50, y: -25, w: bucketWidth + 100, h: height + 50, nodes: [] });
      }

      nodes.forEach((node) => {
        buckets.forEach((bucket) => {
          if (node.x >= bucket.x && node.x <= bucket.x + bucket.w && node.y >= bucket.y && node.y <= bucket.y + bucket.h) {
            bucket.nodes.push(node);
          }
        });
      });


      self.postMessage({ nodes, buckets });
      break;
    case 'stop':
      self.close();
      break;
  };
});
