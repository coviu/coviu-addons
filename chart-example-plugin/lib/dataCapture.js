import { EventEmitter2 } from 'eventemitter2'
import { RESOURCE_TYPE } from './constants'
// import ECG from '../test/ecg'
import ECG from '../test/healthy_person1'

const BP = ['120/80', '119/80', '114/79', '121/81'];
const MAX_POINTS = 3000; // 30 seconds of data points

/**
 * Example of data capture
 */
export default function(api, item, mesh) {

    const DATA_ROW = `${RESOURCE_TYPE}-${item.id}`;
    const capture = new EventEmitter2();

    // Create a data set used for transmitting data points across the CRDT
    // Note that the CRDT is ideally suited for transmitting eventually consistent
    // data, but is not suited necessarily for high throughput data
    const dataset = mesh.createSet('type', DATA_ROW);

    let timers = [];
    let count = 0;
    let ecg = 0;
    // Cache
    let data = [];

    if (!api.streaming && !api.streaming.events) {
        throw new Error('Coviu Stream Events API not available');
    }

    // Handle ECG data updates
    const updateEcg = (p) => {
        if (data.length >= MAX_POINTS) data.shift();
        data.push(p);
        capture.emit('ecg', p);
    }

    // An encoder for ECG data (write as double)
    const encoder = (data, opts) => {
        // Write a 64bit
        const buffer = Buffer.alloc(8);
        buffer.writeDoubleLE(data, 0);
        return buffer;
    }

    // A decoder for ECG data (read as double)
    const decoder = (buffer) => {
        const value = buffer.readDoubleLE(0);
        return value;
    }

    // This creates an event stream for ECG data
    const eventStream = api.streaming.events('ecg', encoder, decoder);

    // Start capturing data
    capture.start = () => {
        // Already started
        if (timers.length > 0) return;

        // NOTE: This is where you would do the bluetooth capture
        // navigator.bluetooth.requestDevice(opts).then(() => {})

        // Generate some low freq data onto the mesh
        timers.push(setInterval(() => {
            count++;
            // Update a static value
            mesh.set(`${item.id}-bp`, {
                type: DATA_ROW,
                key: 'bp',
                value: BP[count % BP.length]
            });
        }, 1000));

        // Generate some high freq data for the event stream
        timers.push(setInterval(() => {
            ecg++;
            const data = ECG[ecg % ECG.length];
            eventStream.to('all', data)
            updateEcg(data);
        }, 10));
    }

    // Stop capturing data
    capture.stop = () => {
        // Already stopped
        if (timers.length === 0) return;
        timers.forEach(clearInterval);
        timers = [];
    }

    capture.data = () => data

    // Handle event stream events
    eventStream.on(updateEcg);

    // Handle update
    dataset.on('changes', (row, changed) => {
        // Ignore deletions
        if (!changed) return;
        capture.emit(changed.key, changed.value);
    })

    return capture;
}