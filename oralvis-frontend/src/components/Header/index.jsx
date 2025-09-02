import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Header() {
  const { user, authLogout } = useAuth()
  const navigate = useNavigate()

    const handleLogoClick = () => {
    if (user) {
      if (user.role.toLowerCase() === "technician") {
        navigate("/technician")
      } else if (user.role.toLowerCase() === "dentist") {
        navigate("/dentist")
      } else {
        navigate("/") 
      }
    } else {
      navigate("/")
    }
  }

  const handleLoginClick = () => {
    navigate("/login") 
  }

  return (
    <header className="bg-gray-100 shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={handleLogoClick}>OralVis</div>
      <div>
        {user ? (
          <button
            onClick={authLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
