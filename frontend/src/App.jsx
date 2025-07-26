import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import { useAutoLogout } from './hooks/useAuth';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  // Handle automatic logout when session expires
  useAutoLogout();

  return (
    <Router>
      <div className="min-h-screen bg-gray-200">
        <Navbar />
        <div className="pt-20">
          <AppRoutes />
        </div>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </Router>
  );
}

export default App;
