import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/Login';
import AdminDashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import UserPage from './pages/User';
import AktaKelahiranPage from './pages/AktaKelahiran';
import SuratKehilanganPage from './pages/SuratKehilangan';
import AktaKematianPage from './pages/AktaKematian';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected with layout */}
          <Route
            element={
              <ProtectedRoute>
                <Toaster richColors position="top-right" />
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/user" element={<UserPage />} />
            <Route path="/admin/layanan-arsip/akta-kelahiran" element={<AktaKelahiranPage />} />
            <Route path="/admin/layanan-arsip/akta-kematian" element={<AktaKematianPage />} />
            <Route path="/admin/layanan-arsip/surat-kehilangan" element={<SuratKehilanganPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
