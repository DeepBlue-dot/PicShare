import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Password reset failed')
      }

      setMessage('Password reset instructions sent to your email')
      setError('')
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your email"
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark"
          >
            Send Reset Instructions
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/auth')}
            className="text-primary hover:text-primary-dark text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}