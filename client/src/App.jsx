import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        Hello from React & Tailwind!
      </h1>
      <p className="mt-4 text-gray-600">
        This is a React application styled with Tailwind CSS
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Click Me
      </button>
    </div>
  )
}

export default App
