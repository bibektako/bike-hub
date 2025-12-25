import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import DestinationAutocomplete from '../components/DestinationAutocomplete';
import MapPicker from '../components/MapPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchProvinces } from '../utils/nepalStates';
import {
  FaStore,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaMap
} from 'react-icons/fa';

const AdminDealerManagement = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'showroom',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: ''
    },
    location: {
      latitude: '',
      longitude: '',
      mapLink: ''
    }
  });
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const { data } = await axios.get('/api/admin/dealers');
      setDealers(data);
    } catch (error) {
      toast.error('Failed to load dealers');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.includes('@')) {
      newErrors.email = 'Email must contain @ symbol';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Dealer name is required';
    }
    
    // Map link validation
    if (!formData.location.mapLink) {
      newErrors.mapLink = 'Map location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      await axios.post('/api/admin/dealers', formData);
      toast.success('Dealer created successfully');
      setShowForm(false);
      resetForm();
      setErrors({});
      fetchDealers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create dealer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dealer?')) return;

    try {
      await axios.delete(`/api/admin/dealers/${id}`);
      toast.success('Dealer deleted successfully');
      fetchDealers();
    } catch (error) {
      toast.error('Failed to delete dealer');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'showroom',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: ''
      },
      location: {
        latitude: '',
        longitude: '',
        mapLink: ''
      }
    });
    setErrors({});
    setStateSuggestions([]);
    setShowStateSuggestions(false);
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      address: { ...formData.address, state: value }
    });
    
    if (value) {
      const suggestions = searchProvinces(value);
      setStateSuggestions(suggestions);
      setShowStateSuggestions(true);
    } else {
      setStateSuggestions([]);
      setShowStateSuggestions(false);
    }
  };

  const handleStateSelect = (province) => {
    setFormData({
      ...formData,
      address: { ...formData.address, state: province }
    });
    setStateSuggestions([]);
    setShowStateSuggestions(false);
  };

  const handlePhoneChange = (e) => {
    // Only allow digits and limit to 10 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: value });
    if (errors.phone) {
      setErrors({ ...errors, phone: '' });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handleMapSelect = (lat, lng, mapLink) => {
    setFormData({
      ...formData,
      location: {
        latitude: lat,
        longitude: lng,
        mapLink: mapLink || `https://www.google.com/maps?q=${lat},${lng}`
      }
    });
    setShowMapPicker(false);
    toast.success('Location selected successfully!');
    // Clear any map link errors
    if (errors.mapLink) {
      setErrors({ ...errors, mapLink: '' });
    }
  };

  // Extract coordinates from Google Maps link if user pastes one
  const handleMapLinkChange = (e) => {
    const link = e.target.value;
    setFormData({
      ...formData,
      location: { ...formData.location, mapLink: link }
    });

    // Try to extract coordinates from Google Maps link
    const coordMatch = link.match(/[?&]q=([^&]+)/);
    if (coordMatch) {
      const coords = coordMatch[1].split(',');
      if (coords.length === 2) {
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              mapLink: link,
              latitude: lat,
              longitude: lng
            }
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <LoadingSpinner size={250} text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaStore className="text-4xl text-primary-600" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Dealer Management
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-accent-600 transition-all shadow-lg"
          >
            <FaPlus />
            <span>Add New Dealer</span>
          </motion.button>
        </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl mb-6 border-2 border-primary-500/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-accent-500 p-2 rounded-lg">
                <FaPlus className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Add New Dealer
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <FaTimes className="text-xl" />
            </motion.button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service Type</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="showroom">Showroom</option>
                  <option value="service_type">Service Type</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone * (10 digits)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2 transition-all ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="98XXXXXXXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
                {formData.phone && !errors.phone && (
                  <p className="text-gray-500 text-xs mt-1">{formData.phone.length}/10 digits</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                <FaMapMarkerAlt className="text-primary-600" />
                <span>Street Address</span>
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City/Destination</label>
                <DestinationAutocomplete
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })
                  }
                  placeholder="Search destination in Nepal..."
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-2">State/Province *</label>
                <input
                  type="text"
                  required
                  value={formData.address.state}
                  onChange={handleStateChange}
                  onFocus={() => {
                    if (formData.address.state) {
                      setStateSuggestions(searchProvinces(formData.address.state));
                      setShowStateSuggestions(true);
                    } else {
                      setStateSuggestions(searchProvinces(''));
                      setShowStateSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow click
                    setTimeout(() => setShowStateSuggestions(false), 200);
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Search province..."
                />
                {showStateSuggestions && stateSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {stateSuggestions.map((province, index) => (
                      <div
                        key={index}
                        onClick={() => handleStateSelect(province)}
                        className="px-4 py-2 hover:bg-primary-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        {province}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center space-x-2">
                <FaMapMarkerAlt className="text-primary-600" />
                <span>Map Location Link *</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={formData.location.mapLink}
                  onChange={handleMapLinkChange}
                  className={`w-full px-4 py-3 pr-16 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all font-medium ${
                    errors.mapLink 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="https://www.google.com/maps?q=27.7172,85.3240"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMapPicker(true);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-600 to-accent-500 text-white p-2.5 rounded-lg hover:from-primary-700 hover:to-accent-600 transition-all shadow-lg z-10"
                  title="Pick location on map"
                >
                  <FaMapMarkerAlt className="text-base" />
                </motion.button>
              </div>
              {errors.mapLink && (
                <p className="text-red-500 text-xs mt-1">{errors.mapLink}</p>
              )}
              <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                <FaMap className="text-primary-600" />
                <span>Click the location icon to select location visually, or paste a Google Maps link</span>
              </p>
              {formData.location.mapLink && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <a
                    href={formData.location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-bold text-sm transition-colors"
                  >
                    <FaMapMarkerAlt />
                    <span>Open in Google Maps</span>
                  </a>
                </motion.div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-accent-600 transition-all shadow-lg"
              >
                <FaCheck />
                <span>Create Dealer</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                <FaTimes />
                <span>Cancel</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border-2 border-primary-500/20">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-600 to-accent-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Name</th>
              <th className="px-6 py-4 text-left font-bold">Type</th>
              <th className="px-6 py-4 text-left font-bold">City</th>
              <th className="px-6 py-4 text-left font-bold">Phone</th>
              <th className="px-6 py-4 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer._id} className="border-b border-gray-200 hover:bg-primary-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">{dealer.name}</td>
                <td className="px-6 py-4 capitalize text-gray-700">
                  {dealer.type === 'service_type' ? 'Service Type' : dealer.type === 'showroom' ? 'Showroom' : dealer.type.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 text-gray-700">{dealer.address?.city}</td>
                <td className="px-6 py-4 text-gray-700">{dealer.phone}</td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(dealer._id)}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* Map Picker Modal */}
      <MapPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onSelect={handleMapSelect}
        initialLat={formData.location.latitude ? parseFloat(formData.location.latitude) : 27.7172}
        initialLng={formData.location.longitude ? parseFloat(formData.location.longitude) : 85.3240}
        initialMapLink={formData.location.mapLink}
      />
    </div>
  );
};

export default AdminDealerManagement;

