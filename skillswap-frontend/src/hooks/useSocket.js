import { useEffect } from 'react';
import { getSocket } from '../services/socket.js';

/**
 * Subscribes to a realtime event for the lifetime of the component.
 * `handler` is expected to be stable-ish (wrap in useCallback if it closes
 * over changing values) — we re-subscribe whenever it changes.
 */
export function useSocketEvent(event, handler, enabled = true) {
  useEffect(() => {
    if (!enabled || !event || typeof handler !== 'function') return undefined;
    const socket = getSocket();
    if (!socket) return undefined;

    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [event, handler, enabled]);
}
