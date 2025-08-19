import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Nav from './components/Nav';
import Hero from './components/Hero';
import Announce from './components/Announce';
import Infra from './components/Infra';
import Gallery from './components/Gallery';
import Map from './components/Map';
import Footer from './components/Footer';
import About from './pages/About';
import Tenders from './pages/Tenders';
import Login from './pages/Login';

import AdminDashboard from './admin/AdminDashboard';
import AdminTenderForm from './admin/AdminTenderForm';
import DashboardHome from './admin/DashboardHome';

function Home() {
  return (
    <>
      <Hero />
      <div className="main-content">
        <Announce />
        <Infra />
        <Gallery />
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
                  <Route path="/gallery" element={<Placeholder title="Gallery" />} />
                  <Route path="/contact" element={<Placeholder title="Contact" />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
                <Footer />
              </>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} /> {/* Default dashboard */}
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="tenders" element={<AdminTenderForm />} />
            {/* Add more admin pages here */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
