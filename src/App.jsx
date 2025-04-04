import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './styles.css';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Full-width navbar with gradient background */}
        <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="text-3xl font-extrabold mb-3 md:mb-0 tracking-tight">
                <span className="text-white">Social Media</span>
                <span className="text-blue-200"> Analytics</span>
              </h1>
              
              <ul className="flex space-x-4 md:space-x-6 font-bold text-lg">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-6 py-2 rounded-md transition-all ${
                        isActive
                          ? "bg-white text-blue-700 font-extrabold shadow-lg"
                          : "bg-blue-400 text-white hover:bg-blue-300 hover:text-blue-800 hover:shadow-md"
                      }`
                    }
                    end
                  >
                    Top Users
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/trending"
                    className={({ isActive }) =>
                      `px-6 py-2 rounded-md transition-all ${
                        isActive
                          ? "bg-white text-blue-700 font-extrabold shadow-lg"
                          : "bg-blue-400 text-white hover:bg-blue-300 hover:text-blue-800 hover:shadow-md"
                      }`
                    }
                  >
                    Trending Posts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/feed"
                    className={({ isActive }) =>
                      `px-6 py-2 rounded-md transition-all ${
                        isActive
                          ? "bg-white text-blue-700 font-extrabold shadow-lg"
                          : "bg-blue-400 text-white hover:bg-blue-300 hover:text-blue-800 hover:shadow-md"
                      }`
                    }
                  >
                    Feed
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto p-4 mt-6">
          <Routes>
            <Route path="/" element={<TopUsers />} />
            <Route path="/trending" element={<TrendingPosts />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
