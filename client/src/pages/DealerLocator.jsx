import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DestinationAutocomplete from '../components/DestinationAutocomplete';
import DealerBikesModal from '../components/DealerBikesModal';
import { FaMapMarkerAlt, FaFilter, FaStore, FaEye } from 'react-icons/fa';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DealerLocator = () => {
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    brand: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showBikesModal, setShowBikesModal] = useState(false);
  const [selectedDealerForBikes, setSelectedDealerForBikes] = useState(null);

  useEffect(() => {
    fetchDealers();
  }, []);

  useEffect(() => {
    filterDealers();
  }, [filters, dealers]);

  const fetchDealers = async () => {
    try {
      const { data } = await axios.get('/api/dealers');
      setDealers(data);
      setFilteredDealers(data);
    } catch (error) {
      toast.error('Failed to load dealers');
    } finally {
      setLoading(false);
    }
  };

  const filterDealers = () => {
    let filtered = [...dealers];

    if (filters.type) {
      filtered = filtered.filter(d => d.type === filters.type);
    }
    if (filters.city) {
      filtered = filtered.filter(d =>
        d.address?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.brand) {
      filtered = filtered.filter(d => d.brands?.includes(filters.brand));
    }

    setFilteredDealers(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading map...</div>;
  }

  const center = filteredDealers.length > 0
    ? [filteredDealers[0].location.latitude, filteredDealers[0].location.longitude]
    : [27.7172, 85.3240]; // Default to Kathmandu, Nepal center

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 flex items-center space-x-3">
          <FaMapMarkerAlt className="text-primary-600" />
          <span>Dealer & Service Center Locator</span>
        </h1>
        <p className="text-gray-600">Find authorized dealers and service centers across Nepal</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <FaFilter className="text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-800">Search Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
          >
            <option value="">All Types</option>
            <option value="showroom">Showroom</option>
            <option value="service_type">Service Type</option>
          </select>
          <DestinationAutocomplete
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="Search destination in Nepal..."
          />
          <input
            type="text"
            name="brand"
            placeholder="Filter by brand..."
            value={filters.brand}
            onChange={handleFilterChange}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dealer List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FaStore className="text-primary-600" />
            <span>
              {filteredDealers.length} {filteredDealers.length === 1 ? 'Location' : 'Locations'} Found
            </span>
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredDealers.map((dealer) => (
              <div
                key={dealer._id}
                className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition ${
                  selectedDealer?._id === dealer._id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div onClick={() => setSelectedDealer(dealer)} className="cursor-pointer">
                  <h3 className="font-bold">{dealer.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{dealer.type.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600">
                    {dealer.address?.street}, {dealer.address?.city}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {dealer.phone}</p>
                  {dealer.brands && dealer.brands.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Brands: {dealer.brands.join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedDealerForBikes(dealer);
                    setShowBikesModal(true);
                  }}
                  className="mt-3 w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  <FaEye />
                  <span>View Listed Bikes</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="h-96 rounded-lg overflow-hidden shadow-md relative" style={{ zIndex: 1 }}>
            <MapContainer
              center={center}
              zoom={7}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredDealers.map((dealer) => (
                <Marker
                  key={dealer._id}
                  position={[dealer.location.latitude, dealer.location.longitude]}
                  eventHandlers={{
                    click: () => setSelectedDealer(dealer)
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold mb-2">{dealer.name}</h3>
                      <p className="text-sm mb-1">{dealer.address?.city}</p>
                      <p className="text-sm mb-2">Phone: {dealer.phone}</p>
                      <button
                        onClick={() => {
                          setSelectedDealerForBikes(dealer);
                          setShowBikesModal(true);
                        }}
                        className="w-full mt-2 bg-primary-600 text-white px-3 py-1 rounded text-xs hover:bg-primary-700 transition-colors"
                      >
                        View Bikes
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {selectedDealer && (
            <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">{selectedDealer.name}</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Type:</span>{' '}
                  {selectedDealer.type.replace('_', ' ').toUpperCase()}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{' '}
                  {selectedDealer.address?.street}, {selectedDealer.address?.city},{' '}
                  {selectedDealer.address?.state}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {selectedDealer.phone}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {selectedDealer.email}
                </p>
                {selectedDealer.brands && selectedDealer.brands.length > 0 && (
                  <p>
                    <span className="font-semibold">Brands:</span>{' '}
                    {selectedDealer.brands.join(', ')}
                  </p>
                )}
                {selectedDealer.services && selectedDealer.services.length > 0 && (
                  <p>
                    <span className="font-semibold">Services:</span>{' '}
                    {selectedDealer.services.join(', ')}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedDealerForBikes(selectedDealer);
                  setShowBikesModal(true);
                }}
                className="mt-4 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white px-4 py-3 rounded-lg hover:from-primary-700 hover:to-accent-600 transition-all font-semibold"
              >
                <FaEye />
                <span>View All Listed Bikes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dealer Bikes Modal */}
      <DealerBikesModal
        isOpen={showBikesModal}
        onClose={() => {
          setShowBikesModal(false);
          setSelectedDealerForBikes(null);
        }}
        dealer={selectedDealerForBikes}
      />
    </div>
  );
};

export default DealerLocator;

