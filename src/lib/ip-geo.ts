import { logger } from "@/lib/logger";

const log = logger("geo");

export interface IpGeoData {
  country: string;
  countryCode: string;
  city: string;
  regionName: string;
  isp: string;
}

// --- In-memory geo cache ---
const GEO_TTL = 60 * 60 * 1000; // 1 hour
const NULL_TTL = 5 * 60 * 1000; // 5 minutes for failed lookups
const MAX_ENTRIES = 5000;

interface CacheEntry {
  data: IpGeoData | null;
  expiry: number;
}

const geoCache = new Map<string, CacheEntry>();

function cacheGet(ip: string): IpGeoData | null | undefined {
  const entry = geoCache.get(ip);
  if (!entry) return undefined;
  if (Date.now() > entry.expiry) {
    geoCache.delete(ip);
    return undefined;
  }
  return entry.data;
}

function cacheSet(ip: string, data: IpGeoData | null): void {
  // Lazy cleanup when at capacity
  if (geoCache.size >= MAX_ENTRIES) {
    const now = Date.now();
    for (const [key, entry] of geoCache) {
      if (now > entry.expiry) geoCache.delete(key);
    }
    // If still full after cleanup, evict oldest 20%
    if (geoCache.size >= MAX_ENTRIES) {
      const toDelete = Math.floor(MAX_ENTRIES * 0.2);
      let deleted = 0;
      for (const key of geoCache.keys()) {
        if (deleted >= toDelete) break;
        geoCache.delete(key);
        deleted++;
      }
    }
  }
  geoCache.set(ip, {
    data,
    expiry: Date.now() + (data ? GEO_TTL : NULL_TTL),
  });
}

// --- Fetch logic ---
async function fetchIpApi(ip: string): Promise<IpGeoData | null> {
  const res = await fetch(
    `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,query`,
    { signal: AbortSignal.timeout(5000) }
  );
  const data = await res.json();
  if (data.status !== "success") return null;
  return {
    country: data.country,
    countryCode: data.countryCode,
    city: data.city,
    regionName: data.regionName,
    isp: data.isp,
  };
}

export async function getIpGeo(
  ip: string,
  cfCountryCode?: string | null
): Promise<IpGeoData | null> {
  // Check cache first
  const cached = cacheGet(ip);
  if (cached !== undefined) {
    log.debug(`cache hit for ${ip}`);
    return cached;
  }

  // Try ip-api.com with one retry
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await fetchIpApi(ip);
      if (result) {
        cacheSet(ip, result);
        return result;
      }
    } catch (err) {
      log.warn(`ip-api.com attempt ${attempt + 1} failed for ${ip}`, err);
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 1000));
  }

  // Fallback: use Cloudflare cf-ipcountry header if available
  if (cfCountryCode && cfCountryCode !== "XX" && cfCountryCode !== "T1") {
    log.info(`using CF fallback for ${ip} (country=${cfCountryCode})`);
    const fallback: IpGeoData = {
      country: "",
      countryCode: cfCountryCode,
      city: "",
      regionName: "",
      isp: "",
    };
    cacheSet(ip, fallback);
    return fallback;
  }

  log.warn(`all geo lookups failed for ${ip}`);
  cacheSet(ip, null);
  return null;
}
