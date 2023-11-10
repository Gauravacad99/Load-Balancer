# Application Load Balancer with Round Robin Algorithm and Health Check

## Overview

This Node.js project implements a simple application load balancer that uses a round-robin algorithm to distribute incoming requests among multiple target servers. Additionally, the load balancer performs health checks on the target servers to ensure that only healthy servers receive incoming traffic.

## Features

- **Round Robin Load Balancing:** Incoming requests are distributed among target servers in a round-robin fashion, ensuring even utilization.

- **Health Check:** The load balancer performs periodic health checks on each target server to determine its availability. Unhealthy servers are temporarily excluded from the rotation.

- **Multi-Process Setup:** The load balancer can take advantage of multiple CPU cores using the Node.js Cluster module, creating separate worker processes for each core.

## Requirements

- Node.js: Make sure you have Node.js installed on your machine. You can download it [here](https://nodejs.org/).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/load-balancer.git
   ```

2. Navigate to the project directory:

   ```bash
   cd load-balancer
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Update the `targets` array in `index.js` with the details of your target servers.

2. Start the load balancer:

   ```bash
   npm start
   ```

3. Access your application through the load balancer at `http://localhost:8000`.

## Configuration

- You can adjust the health check interval and other settings in the `index.js` file.

## Contributing

Contributions are welcome! Please follow the [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

---
