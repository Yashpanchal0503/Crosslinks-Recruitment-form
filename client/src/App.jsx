import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Application from './pages/Application';
import Round2 from './pages/Round2';
import Round2Results from './pages/Round2Results';
import FinalResults from './pages/FinalResults';
import Success from './pages/Success';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import Round2Closed from './pages/Round2Closed';

function App() {
  return (
    <ThemeProvider>
      <div className="dotted-bg-overlay" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<FinalResults />} />
            <Route path="/final" element={<FinalResults />} />
            <Route path="/results" element={<FinalResults />} />
            <Route path="/round1" element={<Application />} />
            <Route path="/round2" element={<Round2Results />} />
            <Route path="/round2/results" element={<Round2Results />} />
            <Route path="/round2/form" element={<Round2 />} />
            <Route path="/round2/closed" element={<Round2Closed />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
