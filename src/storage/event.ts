import {EventEmitter} from "events";

export const ee = new EventEmitter();

export function dispatchQueueProgress(payload: {
    id: string,
    type: 'debug' | 'process-article',
    progress: number
    resource_id: string
}): void {
    ee.emit('end', payload);
}
