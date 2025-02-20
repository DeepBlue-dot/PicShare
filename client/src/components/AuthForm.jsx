import { useForm } from 'react-hook-form'
import { GoogleLoginButton, FacebookLoginButton } from 'react-social-login-buttons'
import { useState, useEffect } from 'react'

export default function AuthForm ({ isLogin, onSubmit, switchMode }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [formError, setFormError] = useState('')
  
    useEffect(() => {
      reset()
      setFormError('')
    }, [isLogin, reset])
  
    const validatePassword = (value) => {
      if (value.length < 8) return 'Password must be at least 8 characters'
      return true
    }
  
    const handleFormSubmit = async (data) => {
      try {
        await onSubmit(data)
      } catch (error) {
        setFormError(error.message || 'An error occurred')
      }
    }
  
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
          )}
  
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
              placeholder="Enter email"
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                validate: validatePassword
              })}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter password"
              type="password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
  
          {formError && (
            <p className="text-red-500 text-sm text-center">{formError}</p>
          )}
  
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
  
        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-primary hover:text-primary-dark text-sm"
          >
            {isLogin 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Login"}
          </button>
        </div>
  
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
  
          <div className="mt-6 grid grid-cols-2 gap-4">
            <GoogleLoginButton onClick={() => {/* Implement Google login */}} />
            <FacebookLoginButton onClick={() => {/* Implement Facebook login */}} />
          </div>
        </div>
      </div>
    )
  }
  