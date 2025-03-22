const cache = new Map();

async function getCache(key) {
    return cache.has(key) ? cache.get(key) : null;
}

async function setCache(key, value, ttl = 60) {
    cache.set(key, value);
    setTimeout(() => cache.delete(key), ttl * 1000); // Expire after `ttl` seconds
}

async function clearCache() {
    cache.clear();
}

module.exports = { getCache, setCache, clearCache };
