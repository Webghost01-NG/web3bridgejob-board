import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, theme } from './styles/GlobalStyles'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import JobListings from './pages/shared/JobListings'
import JobDetail from './pages/shared/JobDetail'
import CompanyDashboard from './pages/company/CompanyDashboard'
import PostJob from './pages/company/PostJob'
import EditJob from './pages/company/EditJob'
import ViewApplications from './pages/company/ViewApplications'
import CandidateDashboard from './pages/candidate/CandidateDashboard'
import MyApplications from './pages/candidate/MyApplications'
import CandidateProfile from './pages/candidate/CandidateProfile'
import NotFound from './pages/NotFound'

const AppContent = () => {
  useAuth()
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Company routes */}
        <Route path="/company/dashboard" element={
          <ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>
        } />
        <Route path="/company/post-job" element={
          <ProtectedRoute role="company"><PostJob /></ProtectedRoute>
        } />
        <Route path="/company/edit-job/:id" element={
          <ProtectedRoute role="company"><EditJob /></ProtectedRoute>
        } />
        <Route path="/company/applications/:jobId" element={
          <ProtectedRoute role="company"><ViewApplications /></ProtectedRoute>
        } />

        {/* Candidate routes */}
        <Route path="/candidate/dashboard" element={
          <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute role="candidate"><MyApplications /></ProtectedRoute>
        } />
        <Route path="/candidate/profile" element={
          <ProtectedRoute role="candidate"><CandidateProfile /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

const App = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContent />
    </ThemeProvider>
  </BrowserRouter>
)

export default App
