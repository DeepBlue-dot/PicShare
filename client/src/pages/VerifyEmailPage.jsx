import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { verifyAccount, error } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        if(!success) {
          await verifyAccount(token);
          setSuccess(true);
          
          // Start countdown timer
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate('/');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }

      } catch (err) {
        setSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verify();
  }, [token, verifyAccount, navigate, success]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <h1 className="text-2xl font-semibold text-gray-700">
            Verifying Your Email...
          </h1>
          <p className="text-gray-500">This should only take a moment</p>
          <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-500 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm space-y-6 text-center">
        {success ? (
          <>
            <div className="animate-bounce">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg 
                  className="w-8 h-8 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Email Verified!
            </h1>
            <p className="text-gray-600">
              Your email address has been successfully verified.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Redirecting in {countdown} seconds...
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Homepage Now
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Verification Failed
            </h1>
            <p className="text-gray-600 px-4">
              {error || 'The verification link is invalid or has expired.'}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Login
              </button>
              <p className="text-sm text-gray-500">
                Need a new verification link?{' '}
                <button
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => console.log('Resend verification logic')}
                >
                  Click here to resend
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;