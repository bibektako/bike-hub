import Lottie from 'lottie-react';
import motorcycleLoading from '../assets/motorcycle-loading.json';

const LoadingSpinner = ({ size = 200, text = 'Loading...', inline = false }) => {
  if (inline) {
    // Inline version for buttons and small spaces
    return (
      <div className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <Lottie 
          animationData={motorcycleLoading} 
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }

  // Full version with text
  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }}>
        <Lottie 
          animationData={motorcycleLoading} 
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {text && (
        <p className="text-gray-600 font-semibold mt-4">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;

