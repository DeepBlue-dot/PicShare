import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from '../components/Spinner'

export default function VerifyEmailPage() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify/${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Verification failed')
        }

        navigate('/auth?verified=true')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [token, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/resend-verification')}
              className="text-primary hover:text-primary-dark font-medium"
            >
              Resend Verification Email
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-4">
              Your account has been successfully verified.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
            >
              Continue to Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}