const express = require('express');
const httpProxy = require('http-proxy');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const request = require('request');

const app = express();
const proxy = httpProxy.createProxyServer({});

// Create an array of target servers to load balance requests.
const targets = [
  { host: 'server1.example.com', port: 3000, healthy: true },
  { host: 'server2.example.com', port: 3000, healthy: true },
  { host: 'server3.example.com', port: 3000, healthy: true },
];

const healthCheckInterval = 10000; // 10 seconds

function performHealthCheck() {
  targets.forEach((target) => {
    request(`http://${target.host}:${target.port}/health`, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        target.healthy = true;
      } else {
        target.healthy = false;
        console.log(`Server ${target.host}:${target.port} is unhealthy`);
      }
    });
  });
}

if (cluster.isMaster) {
  // Fork workers for each CPU core.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Create an HTTP server using Express.
  app.use((req, res) => {
    // Perform a health check before routing the request.
    performHealthCheck();

    // Select a healthy target server in a round-robin fashion.
    let selectedTarget = targets[currentTargetIndex];

    for (let i = 0; i < targets.length; i++) {
      selectedTarget = targets[currentTargetIndex];
      currentTargetIndex = (currentTargetIndex + 1) % targets.length;
      if (selectedTarget.healthy) {
        break;
      }
    }

    // Proxy the request to the selected target server.
    proxy.web(req, res, { target: `http://${selectedTarget.host}:${selectedTarget.port}` });
  });

  // Set up periodic health checks.
  const healthCheckIntervalId = setInterval(performHealthCheck, healthCheckInterval);

  // Listen on a specific port for incoming requests.
  const port = 8000;
  app.listen(port, () => {
    console.log(`Worker ${process.pid} is running on port ${port}`);
  });
}
