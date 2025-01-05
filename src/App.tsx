import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, LineChart, Menu } from 'lucide-react';
import { Market } from './pages/Market';
import { Dashboard } from './pages/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { PortfolioProvider } from './context/PortfolioContext';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    // Also update the document class for Tailwind dark mode
    document.documentElement.classList.toggle('dark');
  };

  return (
    <PortfolioProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <LineChart className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <span className="ml-2 text-xl font-bold dark:text-white">CryptoAI</span>
                </div>
                
                <div className="hidden md:flex items-center space-x-8">
                  <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Market
                  </Link>
                  <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center">
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Dashboard
                  </Link>
                  <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                </div>

                <div className="md:hidden flex items-center space-x-4">
                  <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Market
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            )}
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Market />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PortfolioProvider>
  );
}

export default App;