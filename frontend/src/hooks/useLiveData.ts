import {useEffect, useState} from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
const CHANNELS = 10;
type DataPoint = { time?: number } & { [key: string]: number };

export function useLiveData() {
    const [data, setData] = useState<{ downsampled: DataPoint[]; movingAverage: { [key: string]: number }[] }>({
        downsampled: Array.from({length: CHANNELS}, () => ({
            time: Date.now(),
            ...Object.fromEntries(Array.from({length: CHANNELS}, (_, i) => [`ch${i}`, 0])),
        })),
        movingAverage: Array.from({length: CHANNELS}, () => ({
            ...Object.fromEntries(Array.from({length: CHANNELS}, (_, i) => [`ch${i}`, 0])),
        }))
    });

    const [worker, setWorker] = useState<Worker | null>(null);

    useEffect(() => {
        const newWorker = new Worker(new URL('../worker.js', import.meta.url), {
            type: 'module',
        });
        setWorker(newWorker);

        newWorker.onmessage = (event) => {
            const {avg, downsampled} = event.data.data;
            if (event.data.type === 'processedData' && Array.isArray(downsampled) && Array.isArray(avg)) {
                const history: number[][] = event.data.data.downsampled;
                const formattedHistory = history.map((values, index) => ({
                    time: Date.now() - (history.length - index) * 10,
                    ...Object.fromEntries(values.map((val, i) => [`ch${i}`, val])),
                }));
                const formattedMovingAverage = [Object.fromEntries(avg.map((val: number, i: number) => [`ch${i}`, val]))];
                setData({downsampled: formattedHistory, movingAverage: formattedMovingAverage});
            }
        };

        return () => {
            newWorker.terminate();
        };
    }, []);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('initialData', (history: number[][]) => {
            if (worker) {
                worker.postMessage({type: 'initialData', data: history});
            }
        });

        socket.on('data', (newValues: number[][]) => {
            if (worker) {
                worker.postMessage({type: 'newData', data: newValues});
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [worker]);

    return data;
}
