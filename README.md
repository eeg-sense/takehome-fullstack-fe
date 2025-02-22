## Real-Time Data Visualization Dashboard

### Overview

This project is a real-time data visualization dashboard that processes high-frequency data streams using WebSockets and
Web Workers for efficient rendering. The system consists of a **TCP server** receiving data, a **Node.js backend**
broadcasting data over **Socket.IO**, and a **React frontend** utilizing a **Web Worker** to handle intensive
computations.

### Features

- Real-time chart rendering using **Recharts**.

- Web Worker for **offloading processing tasks** (downsampling, buffering).

- Moving average chart for **smoothed data visualization**.

- Optimized WebSocket communication to ensure **minimal performance overhead**.

### Getting Started

#### Prerequisites

- **Node.js** (v18+)

- **npm** or **yarn**

#### Installation

```
# Clone the repository
git clone 


# Install dependencies
cd backend && npm install 
cd frontend && npm install 

```

#### Running the Project

```
# Run the mock data generator 
node datagen.js
# Start the backend server
cd backend
npm run dev

# Start the frontend app
cd frontend
npm start
```

The backend will listen on **port 3000**, and the frontend will be available at [**http://localhost:5713
**](http://localhost:5713).

#### WebSocket Events

- **initialData** → Sent to new clients when they connect.

- **data** → Sent every 5 seconds, containing raw and moving average values.

#### Worker Processing

The **Web Worker** processes data by:

1. **Buffering** the last 30 seconds of data.

2. **Downsampling** (reducing data points for better performance).

3. **Computing moving averages** for smoother visualization.

----------

## Architecture Choices

### Data Handling

- **TCP Stream** (100 samples/sec) → Buffered in **Node.js**

- **Node.js Server** processes, buffers, and sends data via **WebSocket (every 5s)**

- **Web Worker** in the frontend **downsamples** and calculates **moving averages**

- **React UI** renders charts using **Recharts** for efficient updates

### Communication

- **TCP → Node.js**: Raw data stream processing

- **Node.js → React (Socket.IO)**: Periodic updates to avoid excessive rendering

- **React → Web Worker**: Offloads heavy calculations from the UI thread

### Rendering Strategy

- **Recharts for efficient graph rendering**

- **Only latest 30s of data kept** in state to reduce memory footprint

- **Moving average computed every second** for smooth visualization

## Challenges & Trade-offs

### Challenges

- **Handling high-frequency data (100 samples/sec) without UI lag**

- **Ensuring smooth, real-time updates without excessive WebSocket traffic**

- **Preventing memory leaks with large buffers**

### Trade-offs

- **Batching updates every 5s** reduces network traffic but adds slight delay

- **Web Worker processing** offloads UI but adds minor serialization overhead

- **Moving average window size (10 samples)** balances smoothness vs. responsiveness

## Future Improvements

- **More interactive UI** (zooming, filtering data per channel)

- **Customizable downsampling and moving average window size**

- **Scalability improvements for handling more channels & users**

- **Backend optimizations** (using streams instead of storing full history in memory)