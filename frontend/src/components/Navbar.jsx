import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, Search, User as UserIcon, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                R
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight -ml-1">RozgarSaathi</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden md:block font-medium dark:text-gray-200">Hi, {user.name}</span>
                {user.role === 'customer' && (
                  <Link to="/post-job" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition shadow-sm hidden sm:block">
                    Post a Job
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition">
                  Log in
                </Link>
                <Link to="/role-selection" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-medium transition shadow-sm">
                  Get Started
                </Link>
              </div>
            )}
            
            {/* Mobile menu button could go here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
