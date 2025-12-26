import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaMotorcycle, 
  FaBalanceScale, 
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserCircle,
  FaCog,
  FaInfoCircle,
  FaLock
} from 'react-icons/fa';
import ChangePasswordModal from '../components/ChangePasswordModal';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaUserCircle className="text-4xl text-primary-600" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2"
          >
            <FaInfoCircle className="text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Viewing as User</span>
            <Link
              to="/admin"
              className="ml-2 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1"
            >
              <FaCog className="text-xs" />
              <span>Go to Admin</span>
            </Link>
          </motion.div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/my-bookings"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 mx-auto">
            <FaCalendarAlt className="text-3xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-center">My Bookings</h3>
          <p className="text-gray-600 text-center">View and manage your test ride bookings</p>
        </Link>

        <Link
          to="/bikes"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 mx-auto">
            <FaMotorcycle className="text-3xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-center">Browse Bikes</h3>
          <p className="text-gray-600 text-center">Explore our collection of bikes</p>
        </Link>

        <Link
          to="/compare"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 mx-auto">
            <FaBalanceScale className="text-3xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-center">Compare Bikes</h3>
          <p className="text-gray-600 text-center">Compare multiple bikes side by side</p>
        </Link>

        <Link
          to="/dealers"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 mx-auto">
            <FaMapMarkerAlt className="text-3xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-center">Find Dealers</h3>
          <p className="text-gray-600 text-center">Locate dealers and service centers</p>
        </Link>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaUser className="text-xl text-primary-600" />
            <h2 className="text-xl font-bold">Account Information</h2>
          </div>
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaLock />
            <span>Change Password</span>
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <FaUser className="text-gray-400" />
            <p><span className="font-semibold">Name:</span> {user?.name}</p>
          </div>
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-gray-400" />
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
          </div>
          {user?.phone && (
            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-400" />
              <p><span className="font-semibold">Phone:</span> {user.phone}</p>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  );
};

export default UserDashboard;

