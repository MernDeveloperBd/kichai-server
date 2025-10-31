// utils/ipUtils.js
const axios = require("axios");

const geoCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip === "127.0.0.1" || ip === "::1") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  return false;
}

function getClientIp(req) {
  const cfIp = req.headers["cf-connecting-ip"];
  const realIp = req.headers["x-real-ip"];
  const xff = req.headers["x-forwarded-for"];
  if (cfIp) return cfIp;
  if (realIp) return realIp;
  if (xff) return xff.split(",")[0].trim();

  const ip =
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  return ip ? ip.replace("::ffff:", "") : "";
}

async function bdDistrictFromLatLon(lat, lon) {
  try {
    const { data } = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { format: "jsonv2", lat, lon, addressdetails: 1 },
      headers: {
        "User-Agent": `${process.env.APP_NAME || "KI CHAI"} (${process.env.ADMIN_APP_EMAIL || "admin@example.com"})`,
        "Accept-Language": "bn,en;q=0.8"
      },
      timeout: 4000
    });
    const a = data?.address || {};
    return a.state_district || a.district || a.county || a.city || a.town || a.village || null;
  } catch {
    return null;
  }
}

async function geoFromIp(ip) {
  const now = Date.now();
  const cached = geoCache.get(ip);
  if (cached && cached.expires > now) return cached.value;

  if (isPrivateIp(ip)) {
    const val = {
      ip,
      city: "Localhost",
      region: "",
      country: "",            // আগের "Bangladesh" সরানো হলো
      timezone: "Asia/Dhaka", // fallback
      lat: null,
      lon: null,
      district: null
    };
    geoCache.set(ip, { value: val, expires: now + CACHE_TTL_MS });
    return val;
  }

  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`, {
      params: { fields: "status,message,query,city,regionName,country,timezone,lat,lon" },
      timeout: 3000
    });

    if (data.status !== "success") throw new Error(data.message || "ip-api failed");

    let district = null;
    if (data.country === "Bangladesh" && data.lat && data.lon) {
      district = await bdDistrictFromLatLon(data.lat, data.lon);
    }

    const val = {
      ip: data.query,
      city: data.city,
      region: data.regionName,
      country: data.country,
      timezone: data.timezone,
      lat: data.lat,
      lon: data.lon,
      district
    };
    geoCache.set(ip, { value: val, expires: now + CACHE_TTL_MS });
    return val;
  } catch {
    const val = { ip, city: "Unknown", region: "", country: "", timezone: "UTC", lat: null, lon: null, district: null };
    geoCache.set(ip, { value: val, expires: now + CACHE_TTL_MS });
    return val;
  }
}

// Helper: dev/test এ debug IP override
function getGeoIpWithOverride(req) {
  let ip = getClientIp(req);
  const debugIp = req.headers["x-debug-ip"] || req.query.debugIp || process.env.DEBUG_IP;
  if (process.env.mode !== "pro" && debugIp) {
    ip = String(debugIp).trim();
  }
  return ip;
}

module.exports = { getClientIp, geoFromIp, getGeoIpWithOverride };