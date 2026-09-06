import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { CalendarPage } from './pages/CalendarPage';
import { TeachersPage } from './pages/TeachersPage';
import { BooksPage } from './pages/BooksPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

// Add new tabs here as real features get built — same pattern the sales
// field tool uses.
const NAV_LINKS = [
  { to: '/schedule', label: 'Schedule' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/books', label: 'Books' },
  { to: '/teachers', label: 'Teachers' },
];

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button
          className="hamburger-button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
        <h1>Librarian Field Tool</h1>
        <button className="link-button" onClick={signOut}>
          Sign Out
        </button>
      </header>

      {menuOpen && (
        <div className="side-menu-backdrop" onClick={() => setMenuOpen(false)}>
          <nav className="side-menu" onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/schedule" element={<PlaceholderPage title="Schedule" />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="*" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </main>
    </div>
  );
}
