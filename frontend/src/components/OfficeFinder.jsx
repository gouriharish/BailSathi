import React from 'react';
import dlsaDirectory from '../data/dlsa-directory.json';

const OfficeFinder = ({ selectedDistrict }) => {
  // Safe fallback to Ernakulam if district is missing or empty string
  const targetDistrict = (selectedDistrict && typeof selectedDistrict === 'string' && selectedDistrict.trim() !== "") 
    ? selectedDistrict 
    : "Ernakulam";

  // Safely extract office list
  const officeList = Array.isArray(dlsaDirectory) 
    ? dlsaDirectory 
    : (dlsaDirectory?.offices || []);
  
  const office = officeList.find(
    (item) => item?.district && item.district.toLowerCase() === targetDistrict.toLowerCase()
  ) || officeList[0]; // Fallback to first available office if not found

  if (!office) {
    return (
      <div className="p-3 bg-amber-50 text-amber-800 rounded border border-amber-200 text-sm">
        No DLSA office records available.
      </div>
    );
  }

  // Safe Google Maps search query URL
  const query = encodeURIComponent(`${office.name || 'DLSA Office'}, ${office.address || targetDistrict}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200 mt-4 max-w-lg mx-auto text-left">
      <h4 className="font-bold text-gray-800 text-lg">{office.name || 'District Legal Services Authority'}</h4>
      <p className="text-sm text-gray-600 mt-1">{office.address}</p>
      
      {office.phone && (
        <p className="text-sm text-gray-700 mt-2">
          <strong>Phone:</strong> <a href={`tel:${office.phone}`} className="text-blue-600 underline">{office.phone}</a>
        </p>
      )}

      {/* Embedded Map Box */}
      <div className="mt-4 w-full h-52 rounded-lg overflow-hidden border border-gray-300 shadow-inner">
        <iframe
          title="DLSA Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={embedUrl}
        ></iframe>
      </div>

      {/* Button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center mt-3 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 text-sm shadow transition"
      >
        📍 Get Directions on Google Maps
      </a>
    </div>
  );
};

export default OfficeFinder;