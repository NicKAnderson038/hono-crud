import TTLCache from '@isaacs/ttlcache'

export const ttlCache = new TTLCache({ max: 10000, ttl: 5000 }) // 5 seconds
