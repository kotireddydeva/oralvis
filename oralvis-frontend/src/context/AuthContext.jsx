import { createContext, useState, useEffect, useContext } from "react"
import {jwtDecode} from "jwt-decode"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser({ role: decoded.role, token })
      } catch (err) {
        localStorage.removeItem("jwtToken")
      }
    }
  }, [])

  const authLogin = (token) => {
    localStorage.setItem("jwtToken", token)

    const decoded = jwtDecode(token)
    setUser({ role: decoded.role, token })
  }

  const authLogout = () => {
    localStorage.removeItem("jwtToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, authLogin, authLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
