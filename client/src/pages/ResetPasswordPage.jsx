import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { resetPassword } = useAuth()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      await resetPassword(data, token)
      setMessage('Password reset successfully!')
      // Delay before redirecting to allow the user to read the success message
      setTimeout(() => navigate('/auth'), 2000)
    } catch (err) {
      setError(err.message || 'Password reset failed')
      setMessage('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              type="password"
              placeholder="Enter new password"
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              type="password"
              placeholder="Confirm new password"
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-500 text-sm text-center" role="alert">
              {message}
            </p>
          )}


          <button
            type="submit"
            className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
   >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
