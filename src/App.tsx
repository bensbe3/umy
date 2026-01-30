import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { CommissionsPage } from './components/pages/CommissionsPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { SponsorPage } from './components/pages/SponsorPage';
import { ContactPage } from './components/pages/ContactPage';
import { DecryptMundiPage } from './components/pages/DecryptMundiPage';
import { ArticleDetailPage } from './components/pages/ArticleDetailPage';
import { ActualiteDetailPage } from './components/pages/ActualiteDetailPage';
import { CachePostPage } from './components/pages/CachePostPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw', background: '#022c22', color: '#f5e6d3' }}>
        <Header />
        <main className="flex-1" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw', background: '#022c22', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/commissions" element={<CommissionsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/decryptmundi" element={<DecryptMundiPage />} />
            <Route path="/decryptmundi/:slug" element={<ArticleDetailPage />} />
            <Route path="/actualite/:id" element={<ActualiteDetailPage />} />
            {/* Admin route - obfuscated */}
            <Route path="/a8f4e2c9d7b1" element={<CachePostPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
