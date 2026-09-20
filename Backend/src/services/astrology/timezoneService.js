const tzLookup = require("tz-lookup");
const { DateTime } = require("luxon");

/**
 * Resolves the IANA timezone identifier for the given geographic coordinates.
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {string} IANA timezone identifier (e.g., 'Asia/Kolkata', 'America/New_York')
 */
function getTimezoneForCoordinates(latitude, longitude) {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    const error = new Error(`Invalid coordinates for timezone lookup: lat=${latitude}, lon=${longitude}`);
    error.code = "INVALID_COORDINATES";
    throw error;
  }

  try {
    const zone = tzLookup(latitude, longitude);
    if (!zone) {
      const error = new Error(`No timezone found for coordinates: lat=${latitude}, lon=${longitude}`);
      error.code = "TIMEZONE_NOT_FOUND";
      throw error;
    }
    return zone;
  } catch (err) {
    const error = new Error(`Failed to resolve timezone for coordinates (${latitude}, ${longitude}): ${err.message}`);
    error.code = "TIMEZONE_NOT_FOUND";
    throw error;
  }
}

/**
 * Converts local birth date and time into an exact UTC instant using the correct IANA timezone.
 * Handles historical daylight saving time (DST) and timezone offsets accurately.
 * 
 * @param {Object} params
 * @param {string} params.dob - Date of birth in YYYY-MM-DD format
 * @param {string} params.tob - Time of birth in HH:mm or HH:mm:ss format
 * @param {string} params.timezone - Valid IANA timezone string
 * @returns {{
 *   ianaTimezone: string,
 *   offsetMinutes: number,
 *   offsetString: string,
 *   utcIso: string,
 *   utcDate: Date,
 *   localIso: string,
 *   isDst: boolean
 * }}
 */
function localTimeToUtc({ dob, tob = "00:00", timezone }) {
  if (!dob || typeof dob !== "string") {
    const error = new Error("Date of birth (dob) is required in YYYY-MM-DD format.");
    error.code = "INVALID_DATE";
    throw error;
  }

  if (!timezone || typeof timezone !== "string") {
    const error = new Error("Timezone string is required.");
    error.code = "TIMEZONE_NOT_FOUND";
    throw error;
  }

  // Normalize tob: ensure format HH:mm or HH:mm:ss
  const cleanTob = (tob || "00:00").trim();
  const timeParts = cleanTob.split(":").map((p) => p.padStart(2, "0"));
  const normalizedTime = timeParts.length >= 3 
    ? `${timeParts[0]}:${timeParts[1]}:${timeParts[2]}` 
    : `${timeParts[0]}:${timeParts[1]}:00`;

  const normalizedDob = dob.trim();
  const dateTimeString = `${normalizedDob}T${normalizedTime}`;

  const localDt = DateTime.fromISO(dateTimeString, { zone: timezone });

  if (!localDt.isValid) {
    const error = new Error(`Invalid date/time '${dateTimeString}' in timezone '${timezone}': ${localDt.invalidReason}`);
    error.code = "INVALID_DATETIME";
    error.details = localDt.invalidExplanation;
    throw error;
  }

  const utcDt = localDt.toUTC();
  const utcDate = utcDt.toJSDate();

  return {
    ianaTimezone: timezone,
    offsetMinutes: localDt.offset,
    offsetString: localDt.toFormat("ZZ"),
    utcIso: utcDt.toISO(),
    utcDate,
    localIso: localDt.toISO(),
    isDst: localDt.isInDST
  };
}

module.exports = {
  getTimezoneForCoordinates,
  localTimeToUtc
};
