import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import OperatorDashboardPage from './pages/operator/DashboardOperator';
import SuratPermohonanPindahPage from './pages/SuratPermohonanPindah';
import SuratPerubahanKependudukanPage from './pages/SuratPerubahanKependudukan';
import HomePage from './pages/Home';
import KategoriPage from './pages/Kategori';
import ArsipDynamicPage from './pages/ArsipDynamic';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
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

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}> <Outlet /> </ProtectedRoute>} >
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/user" element={<UserPage />} />
              <Route path="/admin/kategori" element={<KategoriPage />} />
              <Route path="/admin/layanan-arsip/akta-kelahiran" element={<AktaKelahiranPage />} />
              <Route path="/admin/layanan-arsip/akta-kematian" element={<AktaKematianPage />} />
              <Route path="/admin/layanan-arsip/surat-kehilangan" element={<SuratKehilanganPage />} />
              <Route path="/admin/layanan-arsip/surat-permohonan-pindah" element={<SuratPermohonanPindahPage />} />
              <Route path="/admin/layanan-arsip/surat-perubahan-kependudukan" element={<SuratPerubahanKependudukanPage />} />
              {/* Dynamic Arsip Route */}
              <Route path="/admin/arsip/:slug" element={<ArsipDynamicPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['OPERATOR']}> <Outlet /> </ProtectedRoute>} >
              <Route path="/operator/dashboard" element={<OperatorDashboardPage />} />
              <Route path="/operator/layanan-arsip/akta-kelahiran" element={<AktaKelahiranPage />} />
              <Route path="/operator/layanan-arsip/akta-kematian" element={<AktaKematianPage />} />
              <Route path="/operator/layanan-arsip/surat-kehilangan" element={<SuratKehilanganPage />} />
              <Route path="/operator/layanan-arsip/surat-permohonan-pindah" element={<SuratPermohonanPindahPage />} />
              <Route path="/operator/layanan-arsip/surat-perubahan-kependudukan" element={<SuratPerubahanKependudukanPage />} />
              <Route path="/operator/arsip/:slug" element={<ArsipDynamicPage />} />
            </Route>
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
