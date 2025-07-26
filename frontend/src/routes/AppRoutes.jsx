import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AddQuestion from '../pages/AddQuestion';
import SearchResults from '../pages/SearchResults';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import AddAdmin from '../pages/AddAdmin';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/add-question"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'HEAD_ADMIN']}>
            <AddQuestion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-admin"
        element={
          <ProtectedRoute allowedRoles={['HEAD_ADMIN']}>
            <AddAdmin />
          </ProtectedRoute>
        }
      />
      <Route path="/search" element={<SearchResults />} />
      {/* 404 catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
