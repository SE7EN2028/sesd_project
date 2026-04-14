type EventCallback = (data: any) => void;

export interface IActivityLog {
    event: string;
    data: any;
    timestamp: Date;
}

export class EventManager {
    private static _instance: EventManager;
    private listeners: Map<string, EventCallback[]>;
    private activityLog: IActivityLog[];

    private constructor() {
        this.listeners = new Map();
        this.activityLog = [];
    }

    static getInstance(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    on(event: string, callback: EventCallback): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    off(event: string, callback: EventCallback): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            this.listeners.set(event, callbacks.filter(cb => cb !== callback));
        }
    }

    emit(event: string, data: any): void {
        this.activityLog.push({ event, data, timestamp: new Date() });
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }

    getRecentActivity(limit: number = 10): IActivityLog[] {
        return this.activityLog.slice(-limit).reverse();
    }
}
