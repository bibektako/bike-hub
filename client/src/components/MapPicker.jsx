import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Custom marker icon
const createCustomIcon = () => {
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

// Component to update map center when initial values change
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const MapPicker = ({ isOpen, onClose, onSelect, initialLat = 27.7172, initialLng = 85.3240, initialMapLink = '' }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);

  useEffect(() => {
    if (isOpen) {
      // Reset location when modal opens
      setSelectedLocation(null);
      setCurrentLat(initialLat);
      setCurrentLng(initialLng);
    }
  }, [isOpen, initialLat, initialLng]);

  const handleLocationSelect = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setCurrentLat(lat);
    setCurrentLng(lng);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      // Generate Google Maps link
      const mapLink = `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`;
      onSelect(selectedLocation.lat, selectedLocation.lng, mapLink);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary-600 to-accent-500 p-2 rounded-lg">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Select Location on Map</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative" style={{ minHeight: '400px', height: '500px' }}>
              <MapContainer
                center={[currentLat, currentLng]}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                className="rounded-b-2xl"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={[currentLat, currentLng]} />
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                    icon={createCustomIcon()}
                  />
                )}
              </MapContainer>
            </div>

            {/* Footer with coordinates and buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Click on the map to select a location</p>
                {selectedLocation ? (
                  <div className="bg-white p-4 rounded-lg border-2 border-primary-500">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Latitude</label>
                          <p className="text-lg font-bold text-primary-600">{selectedLocation.lat.toFixed(6)}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Longitude</label>
                          <p className="text-lg font-bold text-primary-600">{selectedLocation.lng.toFixed(6)}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Google Maps Link</label>
                        <p className="text-sm text-primary-600 break-all font-medium">
                          https://www.google.com/maps?q={selectedLocation.lat.toFixed(6)},{selectedLocation.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 text-center">No location selected yet</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  disabled={!selectedLocation}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-accent-500 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Confirm Location
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MapPicker;

