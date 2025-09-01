import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./components/Login"
import Home from "./components/Home"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import Technician from './components/Technician'
import Dentist from './components/Dentist'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/technician" element={<Technician />} />
            <Route path="/dentist" element={<Dentist />} />
            <Route path="/"  element={<Home />} />
          </Route>
        </Routes>
      </Router>
      </AuthProvider>
  )
}
export default App
