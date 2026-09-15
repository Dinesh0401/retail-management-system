import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isProducts = currentPath === '/products';

  return (
    <div className="app-layout">
      {/* Top Application Navigation Bar */}
      <header className="app-top-nav">
        <div className="nav-container">
          <div
            className="nav-brand"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            title="Go to Dashboard"
          >
            <span className="brand-badge">RMS</span>
            <span className="brand-name">Smart Retail System</span>
          </div>

          <nav className="nav-menu">
            <button
              type="button"
              className={`nav-tab ${!isProducts ? 'active' : ''}`}
              onClick={() => navigate('/')}
            >
              📊 Intelligence Dashboard
            </button>
            <button
              type="button"
              className={`nav-tab ${isProducts ? 'active' : ''}`}
              onClick={() => navigate('/products')}
            >
              📦 Products (CRUD)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="app-viewport">
        {isProducts ? (
          <Products onNavigate={navigate} />
        ) : (
          <Dashboard onNavigate={navigate} />
        )}
      </main>
    </div>
  );
}

export default App;