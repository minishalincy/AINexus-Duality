import { openDB } from 'idb';

const DB_NAME = 'offline-store';
const STORE_NAME = 'request-queue';

export interface QueuedRequest {
    id?: number;
    url: string;
    method: string;
    body: unknown;
    headers: Record<string, string>;
    timestamp: number;
    tempId?: string;
}

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('tempId', 'tempId', { unique: false });
            }
        },
    });
};

export const queueRequest = async (url: string, method: string, body: unknown, headers: Record<string, string>, tempId?: string) => {
    const db = await initDB();
    await db.add(STORE_NAME, {
        url,
        method,
        body,
        headers,
        timestamp: Date.now(),
        tempId
    });
};

export const getQueue = async (): Promise<QueuedRequest[]> => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

export const removeRequestByTempId = async (tempId: string) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const index = tx.store.index('tempId');
    let cursor = await index.openCursor(IDBKeyRange.only(tempId));
    
    while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
    }
    await tx.done;
};

export const updateRequest = async (id: number, updates: Partial<QueuedRequest>) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = await store.get(id);
    if (req) {
        await store.put({ ...req, ...updates });
    }
    await tx.done;
};

export const clearQueue = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};

export const removeRequest = async (id: number) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};
