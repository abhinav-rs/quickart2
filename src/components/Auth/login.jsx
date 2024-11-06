import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { supabase } from '../../supabaseClient'; 
import bcrypt from 'bcryptjs';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('Auth')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError) {
      setError('Failed to fetch user data. Please try again.');
      return;
    }

    if (!data) {
      setError('User not found. Please sign up.');
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
      setError('Invalid password. Please try again.');
      return;
    }

    localStorage.setItem("userEmail", email);
    console.log('Saved email:', email);

    // Navigate based on user type
    if (data.Type === 'seller') {
      navigate('/SellerLanding'); 
    } else if (data.Type === 'customer') {
      navigate('/Customer'); // Ensure this matches your route
    } else {
      setError('Unknown user type. Please contact support.');
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2 className='login-title'>Login</h2>
        <form onSubmit={handleLogin}>
          {error && <p className='error-message'>{error}</p>}
          <div className='form-group'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder='Enter Email'
              autoComplete='off'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='input-field'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder='Enter Password'
              autoComplete='off'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='input-field'
              required
            />
          </div>
          <button type='submit' className='login-button'>
            Login
          </button>
        </form>
        <p className='signup-link'>Don&apos;t have an account?</p>
        <Link to='/Signup'>
          <button className='signup-button'>
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
