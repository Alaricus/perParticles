const getDistance = (node1, node2) => {
  const distanceX = Math.abs(node1.x - node2.x);
  const distanceY = Math.abs(node1.y - node2.y);
  return Math.sqrt(distanceX ** 2 + distanceY ** 2);
};

self.addEventListener('message', e => {
  const { command, bucket } = e.data;
  switch (command) {
    case 'process':
      const lines = [];

      bucket.nodes.forEach((node, i) => {
        bucket.nodes.slice(i + 1).forEach(n => {
          const distance = getDistance(node, n);
          if (distance < 150) {
            lines.push({ n1: node, n2: n, distance });
          }
        });
      });

      self.postMessage({ lines });
      break;
    case 'stop':
      self.close();
      break;
  };
});
