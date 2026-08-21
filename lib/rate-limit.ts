type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now(); if(store.size>10000)for(const[k,v]of store)if(v.resetAt<now)store.delete(k); const current = store.get(key);
  if (!current || current.resetAt < now) { store.set(key, { count: 1, resetAt: now + windowMs }); return true; }
  if (current.count >= limit) return false;
  current.count++; return true;
}

export function clientIp(request: Request) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"; }
