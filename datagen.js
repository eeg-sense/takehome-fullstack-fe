const net = require('net');

const PORT = 9000;
const INTERVAL = 10; // 100 times/sec

const server = net.createServer((socket) => {
    console.log('New connection established.');

    // Set keep-alive to detect disconnections
    socket.setKeepAlive(true, 1000);

    // Handle socket timeout
    socket.setTimeout(5000);
    socket.on('timeout', () => {
        console.log('Socket timeout, destroying connection');
        socket.destroy();
    });

    const sendData = setInterval(() => {
        try {
            // Check if socket is still writable
            if (socket.writable) {
                const sample = Array.from({length: 10}, () => Math.floor(Math.random() * 21));
                socket.write(JSON.stringify(sample) + '\n');
            } else {
                clearInterval(sendData);
                console.log('Socket no longer writable, stopping data transmission');
            }
        } catch (err) {
            clearInterval(sendData);
            console.error('Error sending data:', err);
            socket.destroy();
        }
    }, INTERVAL);

    socket.on('end', () => {
        clearInterval(sendData);
        console.log('Connection closed by client.');
    });

    socket.on('error', (err) => {
        clearInterval(sendData);
        console.error('Socket error:', err);
        socket.destroy();
    });

    socket.on('close', (hadError) => {
        clearInterval(sendData);
        console.log(`Connection closed ${hadError ? 'due to error' : 'normally'}`);
    });
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server shut down successfully');
        process.exit(0);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});