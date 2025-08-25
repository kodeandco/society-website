import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Nav from './components/Nav';
import Hero from './components/Hero';
import Announce from './components/Announce';
import Infra from './components/Infra';
import Gallery from './components/GalleryComponent';
import GalleryPage from './pages/Gallery.jsx';
import Map from './components/Map';
import Footer from './components/Footer';
import About from './pages/About';
import Tenders from './pages/Tenders';
import Login from './pages/Login';
import AdminLogin from './admin/AdminLogin.jsx'; // Add this import
import AdminDashboard from './admin/AdminDashboard';
import AdminTenderForm from './admin/AdminTenderForm';
import DashboardHome from './admin/DashboardHome';
import Signup from './pages/Signup';
import AdminGalleryForm from './admin/AdminGalleryForm.jsx';
import Contact from './pages/Contact'; // Add this import

function Home() {
  return (
    <>
      <Hero />
      <div className="main-content">
        <Announce />
        <Infra />
        <Map />
      </div>
    </>
  );
}

function Placeholder({ title }) {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '2rem',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 16px #0001',
        textAlign: 'center'
      }}
    >
      <h1>{title}</h1>
      <p>Coming soon...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="main-bg">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <>
                <Nav />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/tenders" element={<Tenders />} />
                  <Route path="/amenities" element={<Placeholder title="Amenities" />} />
                  <Route path="/gallery" element={<GalleryPage title="Gallery" />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                   <Route index element={<DashboardHome />} />
            <Route path="admin/dashboard" element={<DashboardHome />} />
            <Route path="admin/tenders" element={<AdminTenderForm />} />
            <Route path="admin/gallery" element={<AdminGalleryForm title="Gallery Management" />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin/settings" element={<Placeholder title="Settings" />} />
            <Route path="admin/reports" element={<Placeholder title="Gallery/Reports" />} />
                </Routes>
                <Footer />
              </>
            }
          />
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;