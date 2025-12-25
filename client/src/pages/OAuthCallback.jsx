import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromToken } = useContext(AuthContext);
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (error === 'oauth_not_configured') {
        toast.error('Google OAuth is not configured. Please use email/password login.');
        navigate('/login');
        return;
      }
      
      if (error) {
        toast.error('OAuth authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          // Fetch user data
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
          const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUserFromToken(userData, token);
            toast.success('Login successful!');
            navigate('/');
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast.error('Failed to complete authentication. Please try again.');
          navigate('/login');
        }
      } else {
        toast.error('No authentication token received.');
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [token, error, navigate, setUserFromToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="text-center">
        {error ? (
          <>
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">Redirecting to login...</p>
          </>
        ) : token ? (
          <>
            <LoadingSpinner size={200} text="Completing Sign In..." />
            <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Completing Sign In...</h2>
            <p className="text-gray-600">Please wait while we set up your account</p>
          </>
        ) : (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;

