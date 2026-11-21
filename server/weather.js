// Current weather for the seven destinations via Open-Meteo (no API key). Cached 15 minutes.
const PLACES = [
  { name: 'Hunza Valley', lat: 36.3167, lon: 74.65 },   // Karimabad
  { name: 'Skardu', lat: 35.2971, lon: 75.6333 },
  { name: 'Naran Kaghan', lat: 34.9061, lon: 73.6497 }, // Naran
  { name: 'Swat Valley', lat: 34.7717, lon: 72.36 },    // Mingora
  { name: 'Murree', lat: 33.907, lon: 73.3943 },
  { name: 'Fairy Meadows', lat: 35.3856, lon: 74.5792 },
  { name: 'Neelum Valley', lat: 34.7967, lon: 74.1783 }, // Sharda
]

const URL_BASE = 'https://api.open-meteo.com/v1/forecast'
const TTL = 15 * 60 * 1000

// WMO weather code -> [label, category]
function describe(code) {
  if (code === 0) return ['Clear sky', 'clear']
  if (code === 1) return ['Mostly clear', 'clear']
  if (code === 2) return ['Partly cloudy', 'cloudy']
  if (code === 3) return ['Overcast', 'cloudy']
  if (code === 45 || code === 48) return ['Fog', 'fog']
  if (code >= 51 && code <= 57) return ['Drizzle', 'rain']
  if (code >= 61 && code <= 67) return ['Rain', 'rain']
  if (code >= 71 && code <= 77) return ['Snow', 'snow']
  if (code >= 80 && code <= 82) return ['Rain showers', 'rain']
  if (code === 85 || code === 86) return ['Snow showers', 'snow']
  if (code >= 95) return ['Thunderstorm', 'storm']
  return ['Unknown', 'cloudy']
}

let cache = null

export async function getWeather() {
  if (cache && Date.now() - cache.at < TTL) return cache.data
  const params = new URLSearchParams({
    latitude: PLACES.map((p) => p.lat).join(','),
    longitude: PLACES.map((p) => p.lon).join(','),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'uv_index_max',
    forecast_days: '1',
    timezone: 'auto',
  })
  const res = await fetch(`${URL_BASE}?${params}`, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`)
  const json = await res.json()
  const list = Array.isArray(json) ? json : [json]
  if (list.length !== PLACES.length) throw new Error('Unexpected Open-Meteo response')
  const data = {
    updatedAt: new Date().toISOString(),
    source: 'open-meteo',
    destinations: list.map((r, i) => {
      const [condition, category] = describe(r.current.weather_code)
      return {
        name: PLACES[i].name,
        temperatureC: r.current.temperature_2m,
        condition,
        category,
        humidity: r.current.relative_humidity_2m,
        windKmh: r.current.wind_speed_10m,
        uvIndex: typeof r.daily?.uv_index_max?.[0] === 'number' ? Math.round(r.daily.uv_index_max[0] * 10) / 10 : null,
      }
    }),
  }
  cache = { at: Date.now(), data }
  return data
}
