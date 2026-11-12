import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix Leaflet's default marker icon issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Thapar University Red Marker
const universityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom PG blue marker
const pgIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const THAPAR_CENTER = [30.3533, 76.3620]; // TIET Campus Coordinates, Patiala

const PropertyMap = ({ properties = [], selectedProperty = null, height = '450px' }) => {
  const center = selectedProperty?.coordinates?.lat
    ? [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng]
    : THAPAR_CENTER;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Thapar University Landmark Marker */}
        <Marker position={THAPAR_CENTER} icon={universityIcon}>
          <Popup>
            <div className="p-1 text-center font-sans">
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">
                Campus Core
              </span>
              <h4 className="font-extrabold text-slate-900 text-xs mt-1">
                Thapar Institute of Engg & Tech (TIET)
              </h4>
              <p className="text-[11px] text-slate-500">Bhadson Road, Patiala</p>
            </div>
          </Popup>
        </Marker>

        {/* Accommodation Property Markers */}
        {properties.map((prop) => {
          if (!prop.coordinates?.lat || !prop.coordinates?.lng) return null;

          const img = prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80';

          return (
            <Marker
              key={prop._id}
              position={[prop.coordinates.lat, prop.coordinates.lng]}
              icon={pgIcon}
            >
              <Popup>
                <div className="w-48 text-left font-sans">
                  <img
                    src={img}
                    alt={prop.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <span className="text-[10px] font-bold text-red-600 block uppercase">
                    {prop.genderPreference} • {prop.propertyType}
                  </span>
                  <h5 className="font-bold text-slate-900 text-xs line-clamp-1">
                    {prop.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {prop.distanceFromThapar} km from campus
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="font-extrabold text-xs text-slate-900">
                      ₹{prop.pricing?.monthlyRent?.toLocaleString('en-IN')}/mo
                    </span>
                    <Link
                      to={`/properties/${prop._id}`}
                      className="text-[11px] font-semibold text-red-600 hover:underline"
                    >
                      View &rarr;
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
