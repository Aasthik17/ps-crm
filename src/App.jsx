import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import FileComplaint from './pages/FileComplaint.jsx';
import TrackComplaint from './pages/TrackComplaint.jsx';
import OfficerDashboard from './pages/OfficerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/file"    element={<FileComplaint />} />
        <Route path="/track"   element={<TrackComplaint />} />
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/admin"   element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
