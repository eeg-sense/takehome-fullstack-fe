import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import * as net from 'net';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Constants
const TCP_DATA_PORT = 9000;  // Port where datagen.js is running
const WEB_PORT = 3000;       // Port for our Express server
const BUFFER_SIZE = 100 * 30; // 30 seconds of data at 100 samples/sec
const dataHistory: number[][] = []; // Stores the last 30 seconds of data
const WINDOW_SIZE = 10; // Moving average over 10 samples
const EMIT_INTERVAL = 5000; // Send data every 5 seconds
const ACCUMULATED_DATA: number[][] = []; // Buffer to collect data between sends

// TCP Client to connect to datagen.js
const tcpClient = new net.Socket();

tcpClient.connect(TCP_DATA_PORT, 'localhost', () => {
    console.log('Connected to data generator server');
});

let tcpDataBuffer = ''; // Changed from dataBuffer to tcpDataBuffer

// Function to calculate moving average for each channel
function calculateMovingAverages(data: number[][]): number[] {
    if (data.length === 0) return [];

    const numChannels = data[0].length;
    const windowData = data.slice(-WINDOW_SIZE);
    const movingAverages = new Array(numChannels).fill(0);

    for (let channel = 0; channel < numChannels; channel++) {
        const sum = windowData.reduce((acc, values) => acc + values[channel], 0);
        movingAverages[channel] = sum / windowData.length;
    }

    return movingAverages;
}

// Modify incoming data handling
tcpClient.on("data", (data) => {
    try {
        tcpDataBuffer += data.toString();
        const lines = tcpDataBuffer.split("\n");
        tcpDataBuffer = lines.pop() || ""; // Keep the last incomplete line

        for (const line of lines) {
            if (line) {
                const values = JSON.parse(line);
                if (dataHistory.length >= BUFFER_SIZE) {
                    dataHistory.shift();
                }
                dataHistory.push(values);
                ACCUMULATED_DATA.push(values); // Collect data for the next interval
            }
        }
    } catch (error) {
        console.error("Error processing data:", error);
    }
});
// Add timer for sending data
setInterval(() => {
    if (ACCUMULATED_DATA.length > 0) {
        const movingAverages = calculateMovingAverages(dataHistory);

        io.emit("data", {
            raw: ACCUMULATED_DATA, // Send all collected data
            avg: movingAverages,
        });

        // Clear the accumulated buffer after sending
        ACCUMULATED_DATA.length = 0;
    }
}, EMIT_INTERVAL);

tcpClient.on('close', () => {
    console.log('Connection to data generator closed');
    // Attempt to reconnect after 5 seconds
    setTimeout(() => {
        tcpClient.connect(TCP_DATA_PORT, 'localhost');
    }, 5000);
});

tcpClient.on('error', (err) => {
    console.error('TCP Client error:', err);
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('New WebSocket client connected');

    // Send initial buffer data to new clients
    console.log("initialData")
    socket.emit('initialData', dataHistory);

    socket.on('disconnect', () => {
        console.log('WebSocket client disconnected');
    });
});

// Express routes
app.get('/health', (req, res) => {
    res.json({status: 'ok'});
});

// Start HTTP server
httpServer.listen(WEB_PORT, () => {
    console.log(`HTTP/WebSocket Server listening on port ${WEB_PORT}`);
});