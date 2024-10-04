import TTLCache from '@isaacs/ttlcache'

export const ttlCache = new TTLCache({ max: 10000, ttl: 5000 }) // 5 seconds

/**
 * The function `getCacheSnapshot` creates a snapshot of a cache object by iterating through its
 * key-value pairs.
 * @Note Every time the blacklisted cache is modified, async create a snapshot and send a json file to s3.
 * This is to ensure that the cache is not lost when the server is restarted. (not currently implemented)
 * @returns {object}
 */
export function getCacheSnapshot() {
    const snapshot = {}
    for (const [key, value] of ttlCache) {
        snapshot[key] = value
    }
    return snapshot
}
