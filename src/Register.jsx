import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { registerAPI } from './utils/apiService';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [fingerId, setFingerId] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerAPI(fullName, email, phone, address, password, fingerId);
      if (data['message']) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have successfully registered.',
        });
        navigate('/login');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Error',
          text: data['error'],
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <div className="w-96 bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl mb-8 text-center">Fingerprint Bank ATM</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-gray-400 p-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
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
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-gray-400 p-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
          <div className="mb-4">
            <input
              type="text"
              placeholder="Finger ID"
              value={fingerId}
              onChange={(e) => setFingerId(e.target.value)}
              className="w-full rounded-md border border-gray-400 p-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Register
          </button>
        </form>
        <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
