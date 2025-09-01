import { createContext, useState, useEffect, useContext } from "react"
import {jwtDecode} from "jwt-decode"
// import Cookies from "js-cookie"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // const token = Cookies.get("jwtToken")
    const token = localStorage.getItem("jwtToken")
    if (token) {
      try {
        const decoded = jwtDecode(token) // ✅ use .default
        setUser({ role: decoded.role, token })
      } catch (err) {
        // Cookies.remove("jwtToken")
        localStorage.removeItem("jwtToken")
      }
    }
  }, [])

  const authLogin = (token) => {
    // Cookies.set("jwtToken", token, { expires: 1 / 24 })
    localStorage.setItem("jwtToken", token)

    const decoded = jwtDecode(token) // ✅ use .default
    setUser({ role: decoded.role, token })
  }

  const authLogout = () => {
    // Cookies.remove("jwtToken")
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
