import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { FaEnvelope, FaMotorcycle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forgot Password">
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaMotorcycle className="text-primary-600 text-4xl" />
            </motion.div>
            <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              BikeHub
            </span>
          </motion.div>
        </div>

        {!emailSent ? (
          <>
            <div className="text-center">
              <p className="text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                  <FaEnvelope className="text-primary-600" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-accent-600 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size={20} inline={true} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <FaEnvelope className="text-green-600 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Email Sent!</h3>
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please check your inbox and click the link to reset your password. The link will expire in 1 hour.
              </p>
            </div>
          </div>
        )}

        <div className="text-center text-sm">
          <span className="text-gray-600">Remember your password? </span>
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;

