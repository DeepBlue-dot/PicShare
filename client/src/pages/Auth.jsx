import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'


function Auth () {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleAuthSubmit = async (data) => {
    try {
      // Replace with actual API call
      const url = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Authentication failed')
      }

      const result = await response.json()
      // Store token and redirect
      localStorage.setItem('token', result.token)
      navigate('/')
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AuthForm 
        isLogin={isLogin}
        onSubmit={handleAuthSubmit}
        switchMode={() => setIsLogin(!isLogin)}
      />
    </div>
  )
}

export default Auth