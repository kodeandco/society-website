import './App.css';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Announce from './components/Announce';
import Infra from './components/Infra';
import Gallery from './components/Gallery';
import Map from './components/Map';
import Footer from './components/Footer';
import About from './pages/About';
import Tenders from './pages/Tenders';
import Login from './pages/Login';  // ✅ Import Login page
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tenders" element={<Tenders />} />
          <Route path="/amenities" element={<Placeholder title="Amenities" />} />
          <Route path="/gallery" element={<Placeholder title="Gallery" />} />
          <Route path="/contact" element={<Placeholder title="Contact" />} />
          <Route path="/login" element={<Login />} /> {/* ✅ Login route */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
