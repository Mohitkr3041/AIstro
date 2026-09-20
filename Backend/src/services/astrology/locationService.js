const axios = require("axios");

// In-memory cache to prevent hitting Nominatim rate limits repeatedly
const geocodeCache = new Map();

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

  const trimmedPlace = place.trim();
  const cacheKey = trimmedPlace.toLowerCase();

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmedPlace)}&format=json&limit=1`,
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
        resolvedName: first.display_name || trimmedPlace
      };
      geocodeCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    const error = new Error(`Geocoding failed for place '${trimmedPlace}': ${err.message}`);
    error.code = "BIRTH_LOCATION_UNRESOLVED";
    error.details = err.message;
    throw error;
  }

  // If Nominatim returns empty array or nothing found:
  const error = new Error(`Unable to resolve coordinates for location: '${trimmedPlace}'.`);
  error.code = "BIRTH_LOCATION_UNRESOLVED";
  throw error;
}

module.exports = {
  resolveLocation,
  geocodeCache
};
