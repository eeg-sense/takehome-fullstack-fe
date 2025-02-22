const MAX_POINTS = 3000; // Store the last 30 seconds of data
const BUFFER_SIZE = 10; // Downsampling: compute the average over 10 samples
const NUM_CHANNELS = 10; // Ensure this matches the number of channels
const MOVING_AVG_WINDOW = 100; // 1-second moving average (assuming 100 samples/sec)

// Initialize buffers for each channel
const buffer = Array.from({length: NUM_CHANNELS}, () => []);

self.onmessage = function (event) {
    if (event.data.type === "initialData") {

        const history = event.data.data; // An array of past `raw` samples

        // Clear existing buffers and initialize with historical data
        for (let i = 0; i < NUM_CHANNELS; i++) {
            buffer[i] = history.map((entry) => entry[i]).slice(-MAX_POINTS);
        }

        // Perform initial downsampling
        const downsampled = buffer.map((channelData) => {
            const downsampledData = [];
            for (let i = 0; i < channelData.length; i += BUFFER_SIZE) {
                const chunk = channelData.slice(i, i + BUFFER_SIZE);
                const avgValue = chunk.reduce((sum, v) => sum + v, 0) / chunk.length;
                downsampledData.push(avgValue);
            }
            return downsampledData;
        });

        self.postMessage({type: "processedData", data: {downsampled, avg: []}});
    }

    if (event.data.type === "newData") {
        const {raw, avg} = event.data.data;
        raw.forEach((dataBatch) => {

            dataBatch.forEach((value, channel) => {
                // Append new data to the buffer
                buffer[channel].push(value);
                // Ensure we only keep the last 30 seconds of data
                if (buffer[channel].length > MAX_POINTS) {
                    buffer[channel] = buffer[channel].slice(-MAX_POINTS);
                }
            });
        });
        console.log('buffer: ', buffer)
        // Perform downsampling by computing the average over BUFFER_SIZE samples
        const downsampled = buffer.map((channelData) => {
            const downsampledData = [];
            for (let i = 0; i < channelData.length; i += BUFFER_SIZE) {
                const chunk = channelData.slice(i, i + BUFFER_SIZE);
                const avgValue = chunk.reduce((sum, v) => sum + v, 0) / chunk.length;
                downsampledData.push(avgValue);
            }
            return downsampledData;
        });


        // Send processed data back to the main thread
        self.postMessage({type: "processedData", data: {downsampled, avg}});
    }
};
