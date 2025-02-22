import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import styles from './RealTimeChart.module.css';
import {useLiveData} from '../../hooks/useLiveData';

const CHANNELS = 10;

export default function RealTimeChart() {
    const {downsampled, movingAverage} = useLiveData();

    return (
        <div className={styles.container}>
            <div className={styles.dashboard}>
                <h2>📊 Real-Time Data Visualization</h2>
                <div className={styles.chart__container}>
                    <LineChart width={900} height={400} data={downsampled}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd"/>
                        <XAxis dataKey="time" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
                               stroke="#666"/>
                        <YAxis stroke="#666"/>
                        <Tooltip/>
                        <Legend/>
                        {Array.from({length: CHANNELS}).map((_, i) => (
                            <Line
                                key={i}
                                type="monotone"
                                dataKey={`ch${i}`}
                                stroke={`hsl(${i * 36}, 100%, 50%)`}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </div>

                <div className={styles.chart__container}>
                    <h3>📊 1-Second Moving Average</h3>
                    <LineChart width={900} height={400} data={movingAverage}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd"/>
                        <XAxis stroke="#666"/>
                        <YAxis stroke="#666"/>
                        <Tooltip/>
                        <Legend/>
                        {Array.from({length: CHANNELS}).map((_, i) => (
                            <Line
                                key={i}
                                type="monotone"
                                dataKey={`ch${i}`}
                                stroke={`hsl(${i * 36}, 70%, 50%)`}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>

                </div>
            </div>
        </div>
    );
}
