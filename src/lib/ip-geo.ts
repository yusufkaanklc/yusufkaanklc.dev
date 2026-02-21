export interface IpGeoData {
  country: string;
  countryCode: string;
  city: string;
  regionName: string;
  isp: string;
}

export async function getIpGeo(ip: string): Promise<IpGeoData | null> {
  try {
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
  } catch {
    return null;
  }
}
