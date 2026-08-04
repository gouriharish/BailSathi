/**
 * Generates a Google Maps directions URL based on DLSA office coordinates or address.
 */
export const getGoogleMapsUrl = (office) => {
  if (!office) return '#';

  // Prefer precise coordinates if Person 2 provided latitude and longitude
  if (office.latitude && office.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`;
  }

  // Fallback to query by office name and full address
  const query = encodeURIComponent(`${office.name}, ${office.address}, ${office.district}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};