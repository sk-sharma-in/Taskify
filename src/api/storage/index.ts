import CacheManager from "cache-manager";

export const storage = CacheManager.caching({
  store: "memory",
  ttl: 3600,
});
