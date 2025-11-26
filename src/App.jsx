import { Routes, Route, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './routes/ProtectedRoute'
import Expenses from './pages/Expenses'
import DCManagement from './pages/DcPage'
import DeliveryAgentManagement from './pages/DeliveryAgentManagement'
import AgentDashboard from './pages/AgentDashboard'
import CashCollectionManagement from './pages/CashCollectionManagement'

function AppContent() {
  const { user } = useAuth()
  return (<>
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="cash-collections" element={<CashCollectionManagement />} />
          <Route path="delivery-agents" element={<DeliveryAgentManagement />} />
          <Route path="agent-analytics" element={<AgentDashboard />} />
          <Route path="dc" element={<DCManagement />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  </>)
}

function App() {

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App;