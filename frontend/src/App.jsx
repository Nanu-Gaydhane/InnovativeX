import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import RoleSelection from './pages/RoleSelection';
import WorkerDashboard from './pages/WorkerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import PostJob from './pages/PostJob';
import JobFeed from './pages/JobFeed';
import WorkerProfile from './pages/WorkerProfile';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) {
    return user.role === 'customer' ? <Navigate to="/customer-dashboard" /> : <Navigate to="/worker-dashboard" />;
  }

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Toaster position="top-center" />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            
            {/* Customer Routes */}
            <Route path="/customer-dashboard" element={
              <PrivateRoute roles={['customer']}><CustomerDashboard /></PrivateRoute>
            } />
            <Route path="/post-job" element={
              <PrivateRoute roles={['customer']}><PostJob /></PrivateRoute>
            } />
            <Route path="/worker/:id" element={
              <PrivateRoute roles={['customer']}><WorkerProfile /></PrivateRoute>
            } />

            {/* Worker Routes */}
            <Route path="/worker-dashboard" element={
              <PrivateRoute roles={['worker']}><WorkerDashboard /></PrivateRoute>
            } />
            <Route path="/job-feed" element={
              <PrivateRoute roles={['worker']}><JobFeed /></PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
