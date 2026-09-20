const axios = require("axios");

// In-memory cache to prevent hitting Nominatim rate limits repeatedly
const geocodeCache = new Map();

/**
 * Normalizes location strings and generates fallback query candidates for geocoding.
 * E.g., "Pritampura,New Delhi, India" -> ["Pritampura, New Delhi, India", "Pitampura, New Delhi, India", "New Delhi, India"]
 * E.g., "Bareily,Uttar Pradesh , India" -> ["Bareily, Uttar Pradesh, India", "Bareilly, Uttar Pradesh, India", "Uttar Pradesh, India"]
 *
 * @param {string} rawPlace
 * @returns {Array<string>}
 */
function buildLocationCandidates(rawPlace) {
  if (!rawPlace || typeof rawPlace !== "string") return [];

  const cleaned = rawPlace
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return [];

  const candidates = [cleaned];

  // Common spelling / formatting corrections
  const corrected = cleaned
    .replace(/\bBareily\b/i, "Bareilly")
    .replace(/\bPritampura\b/i, "Pitampura");

  if (corrected !== cleaned && !candidates.includes(corrected)) {
    candidates.push(corrected);
  }

  // If 3+ comma parts exist (sub-locality, city, country), try broader city/country fallback
  const parts = cleaned.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 3) {
    const broader = parts.slice(1).join(", ");
    if (!candidates.includes(broader)) candidates.push(broader);

    const correctedBroader = parts.slice(1).join(", ").replace(/\bBareily\b/i, "Bareilly").replace(/\bPritampura\b/i, "Pitampura");
    if (!candidates.includes(correctedBroader)) candidates.push(correctedBroader);
  }

  return candidates;
}

/**
 * Resolves birth location coordinates.
 * Strictly avoids hardcoded defaults (e.g. Delhi).
 * 
 * @param {Object} params
 * @param {string} [params.place] - Name of city/place
 * @param {number} [params.latitude] - Explicit latitude if already known
 * @param {number} [params.longitude] - Explicit longitude if already known
 * @returns {Promise<{ latitude: number, longitude: number, resolvedName: string }>}
 */
async function resolveLocation({ place, latitude, longitude }) {
  // If valid coordinates are provided directly, validate and use them
  if (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  ) {
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      const error = new Error("Coordinates out of range. Latitude must be between -90 and 90, longitude between -180 and 180.");
      error.code = "INVALID_COORDINATES";
      throw error;
    }
    return {
      latitude,
      longitude,
      resolvedName: place || `${latitude}, ${longitude}`
    };
  }

  if (!place || typeof place !== "string" || place.trim().length === 0) {
    const error = new Error("Birthplace is required and was not provided.");
    error.code = "BIRTH_LOCATION_UNRESOLVED";
    throw error;
  }

  const candidates = buildLocationCandidates(place);
  if (candidates.length === 0) {
    const error = new Error("Birthplace is required and was not provided.");
    error.code = "BIRTH_LOCATION_UNRESOLVED";
    throw error;
  }

  const cacheKey = candidates[0].toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  let lastGeocodeError = null;

  for (const candidate of candidates) {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(candidate)}&format=json&limit=1`,
        {
          headers: { "User-Agent": "AIstro-VedicEngine/2.0 (astrology-service)" },
          timeout: 8000
        }
      );

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const first = response.data[0];
        const result = {
          latitude: parseFloat(first.lat),
          longitude: parseFloat(first.lon),
          resolvedName: first.display_name || candidate
        };
        geocodeCache.set(cacheKey, result);
        return result;
      }
    } catch (err) {
      lastGeocodeError = err;
    }
  }

  if (lastGeocodeError) {
    const error = new Error(`Geocoding failed for place '${place}': ${lastGeocodeError.message}`);
    error.code = "BIRTH_LOCATION_UNRESOLVED";
    error.details = lastGeocodeError.message;
    throw error;
  }

  const error = new Error(`Unable to resolve coordinates for location: '${place}'.`);
  error.code = "BIRTH_LOCATION_UNRESOLVED";
  throw error;
}


module.exports = {
  resolveLocation,
  geocodeCache
};
