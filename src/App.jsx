import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Subjects } from './pages/Subjects';
import { SubjectDetail } from './pages/SubjectDetail';
import { Practice } from './pages/Practice';
import { Exam } from './pages/Exam';
import { Progress } from './pages/Progress';
import { Admin } from './pages/Admin';
import { Paper } from './pages/Paper';
import { PdfLibrary } from './pages/PdfLibrary';
import { PdfLibraryHero } from './pages/PdfLibraryHero';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PdfLibraryHero />} />
          <Route path="/pdf-library" element={<PdfLibrary />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/home" element={<Home />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/paper" element={<Paper />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
