import './App.css';
import { FaSun, FaMoon, FaUserAlt } from "react-icons/fa";
import { useEffect, useState } from 'react';
import Login from './Login';
import LoggedIn from './LoggedIn';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState('light');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      setLoggedIn(true);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={`App ${theme}`}>
      <header className='App-header'>
        <h4>Task Management Application</h4>
        <div className='App-header-profile'>
          <button className='ThemeButton' onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          {loggedIn && <UserDropdown email={localStorage.getItem('email')} logout={logout} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />}
        </div>
      </header>
      <main className="App-body">
        {loggedIn ? <LoggedIn /> : <Login />}
      </main>
    </div>
  );
}

function UserDropdown({ email, logout, dropdownOpen, setDropdownOpen }) {
  return (
    <div className="UserDropdown">
      <button onClick={() => setDropdownOpen(!dropdownOpen)}> <FaUserAlt /> {email} ▼ </button>
      {dropdownOpen && (
        <div className="DropdownMenu">
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
