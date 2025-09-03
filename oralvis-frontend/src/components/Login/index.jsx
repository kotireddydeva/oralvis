import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'

const {VITE_API_URL} = import.meta.env

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { authLogin, user } = useAuth()

  useEffect(() => {
    if (user) {
      if (user.role === "Technician") {
        navigate("/technician")
      } else if (user.role === "Dentist") {
        navigate("/dentist")
      }
    }
  }, [user, navigate])


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const response = await axios.post(`${VITE_API_URL}/login`, { email, password })

      const { token } = response.data
      authLogin(token)
      console.log('hello')
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.role === "technician") {
        navigate("/technician")
      } else if (payload.role === "dentist") {
        navigate("/dentist")
      } else {
        setError("Unknown role")
      }
    } catch (err) {

      setError("Invalid email or password")
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>

  )
}

export default Login