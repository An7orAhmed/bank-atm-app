import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { saveUser } from './utils/storage';
import { loginAPI } from './utils/apiService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginAPI(email, password);
      if(data['user']) {
        saveUser(data['user']);
        navigate('/');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: data['error'],
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <div className="w-96 bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl mb-8 text-center">Fingerprint Bank ATM</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-400 p-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-400 p-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Login
          </button>
        </form>
        <p className="text-center mt-4">Don&apos;t have an account? <Link to={'/register'} className="text-blue-500 hover:underline">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
