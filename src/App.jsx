import Hero from "./pages/Hero"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import JobDetails from "./pages/JobDetails"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminSignup from "./pages/admin/AdminSignup"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminRoute from "./pages/admin/AdminRoute"
import AuthTest from "./pages/AuthTest"

const App = ()=>{
  return(
    <div className="w-full min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App