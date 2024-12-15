import './App.css';
import axios from 'axios';
import { useState } from 'react';

function Login() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);

  const toggleForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setCreatingAccount(!creatingAccount);
    setError("");
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      setError("");
      const { name, email, password } = formData;
      const response = await axios.post("http://localhost:5000/register", { name, email, password });
      window.location.reload();
    } else {
      setError("Passwords do not match");
    }
  };

  const login = async () => {
    try {
      const { email, password } = formData;
      const response = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('token', response.data.token);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="Login">
      <div className="login-form">
          <h2>{creatingAccount ? 'Create Account' : 'Login'}</h2>
          <form>
            {!creatingAccount && (
              <div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                {error === ' '? ' ' 
                : <div className="error-message">
                    {error}
                  </div>}
                <button type="submit" onClick={login}>Login</button>
              </div>
            )}
            
            {creatingAccount && (
              <div>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>
                {error === ' '? ' ' 
                : <div className="error-message">
                    {error}
                  </div>}
                <button type="submit" onClick={handleRegistration}>Register</button>
              </div>
            )}
          </form>
          <p>
            {creatingAccount
              ? "Have an account? "
              : "Don't have an account? "}
            <button onClick={toggleForm} className="link-button">
              {creatingAccount ? 'Login' : 'Create an account'}
            </button>
          </p>
        </div>
    </div>
  );
}

export default Login;