export interface IpGeoData {
  country: string;
  countryCode: string;
  city: string;
  regionName: string;
  isp: string;
}

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
  // Try ip-api.com with one retry
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await fetchIpApi(ip);
      if (result) return result;
    } catch {
      // wait before retry
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 1000));
  }

  // Fallback: use Cloudflare cf-ipcountry header if available
  if (cfCountryCode && cfCountryCode !== "XX" && cfCountryCode !== "T1") {
    return {
      country: "",
      countryCode: cfCountryCode,
      city: "",
      regionName: "",
      isp: "",
    };
  }

  return null;
}
