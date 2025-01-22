import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import TaskView from './views/TaskView';
import Home from './views/Home';
import About from './views/About';
import Tags from './views/Tags';
import NavMenu from './components/NavMenu'; 
import './styles/global.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);


// Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:3010/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

// Fetch tags
  const fetchTags = async () => {
    try {
      const res = await fetch('http://localhost:3010/tags');
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTags();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu open/close state
  };

  return (
    <Router>
      <div className="app-container">
        <div className='mobile-menu'>
      <button className="hamburger-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon="fa-solid fa-bars" /> Menu
        </button>
        </div>
        
        <div className={`navigation-container ${isMenuOpen ? 'open' : ''}`}>
          <nav>
            <ul>
              <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}><FontAwesomeIcon icon="fa-solid fa-house" /> Home</NavLink></li>
              <li><NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}><FontAwesomeIcon icon="fa-solid fa-circle-info" /> About</NavLink></li>
              <li><NavLink to="/tags" className={({ isActive }) => (isActive ? 'active' : '')}><FontAwesomeIcon icon="fa-solid fa-tag" /> Tags</NavLink></li>
            </ul>
            <h3 className='nav-parent'><FontAwesomeIcon icon="fa-solid fa-bars-progress" /> Tasks</h3>
            <ul>
              <NavMenu tasks={tasks} refreshTasks={fetchTasks} />
            </ul>
          </nav>
        </div>
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home refreshTasks={fetchTasks} />} />
            <Route path="/about" element={<About refreshTasks={fetchTasks} />} />
            <Route path="/tags" element={<Tags refreshTags={fetchTags} />} />
            <Route path="/task/:taskId" element={<TaskView refreshTasks={fetchTasks} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
library.add(fas)
