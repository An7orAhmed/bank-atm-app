import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { clearUser, getUser } from './utils/storage';
import { URL } from './utils/apiService';
import { LuLogOut } from "react-icons/lu";
import { IoRefreshCircleOutline } from "react-icons/io5";

const Dashboard = () => {
  const user = getUser();
  const [balance, setBalance] = useState(parseFloat(user?.balance));
  const [transactions, setTransactions] = useState([]);
  const [cashInAmount, setCashInAmount] = useState('');
  const [showCashInModal, setShowCashInModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null) navigate("/login");
    fetch(`${URL}?transactions&fingerId=${user?.finderId}`)
      .then(resp => resp.json())
      .then(data => {
        if (data['transactions']) {
          console.log(data['transactions']);
        }
      });
  }, [user, navigate]);

  // Function to handle cash in
  const handleCashIn = async () => {
    setShowCashInModal(true);
  };

  // Function to handle balance refresh
  const handleRefresh = async () => {
    
  };

  // Function to handle logout
  const handlelogout = async () => {
    clearUser();
    navigate("/login");
  };

  // Function to close the cash in modal
  const handleCloseCashInModal = () => {
    setShowCashInModal(false);
    setCashInAmount('');
  };

  // Function to submit cash in amount
  const handleCashInSubmit = async () => {
    if (!cashInAmount || isNaN(parseFloat(cashInAmount))) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Please enter a valid amount.',
      });
      return;
    }
    const newBalance = balance + parseFloat(cashInAmount);
    setBalance(newBalance);
    const newTransection = { date: new Date().toISOString().slice(0, 10), time: new Date().toLocaleTimeString(), type: 'Credit', amount: parseFloat(cashInAmount) };
    setTransactions([...transactions, newTransection]);
    setShowCashInModal(false);
    setCashInAmount('');
    Swal.fire({
      icon: 'success',
      title: 'Cash In Successful',
      text: 'Amount added to your balance.',
    });
  };

  return (
    <div className="flex justify-center p-10 bg-slate-100 min-h-screen">
      <div className="max-w-4xl w-full gap-8">
        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className='flex justify-between'>
            <h1 className="text-slate-600 text-3xl font-bold mb-4">User Information</h1>
            <button onClick={handlelogout} className="bg-red-500 text-white h-7 px-2 rounded-md hover:bg-red-600">
              <LuLogOut />
            </button>
          </div>
          <hr className='mb-3' />
          <p className="mb-2"><strong>Finger ID: </strong>{user?.finger_id}</p>
          <p className="mb-2"><strong>Name: </strong>{user?.full_name}</p>
          <p className="mb-2"><strong>Email: </strong>{user?.email}</p>
          <p className="mb-2"><strong>Address: </strong>{user?.address}</p>
          <p className="my-2"><strong>Current Balance:</strong></p>
          <div className='flex justify-between pt-3'>
            <p className='flex items-center'>
              <span className='bg-blue-600 text-white text-xl font-bold p-2 px-4 rounded-md'>{balance.toFixed(2)} TK</span>
              <button onClick={handleRefresh}>
                <IoRefreshCircleOutline className="text-4xl ml-2 text-slate-500" />
              </button> 
            </p> 
            <button onClick={handleCashIn} className="bg-blue-500 text-white p-2 px-4 rounded-md hover:bg-blue-600">
              Cash In
            </button>
          </div>
        </div>

        {/* Transaction Record Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-slate-600 text-3xl font-bold mb-4">Transaction History</h1>
          <hr className='mb-3' />
          <div className="overflow-auto max-h-80">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {transactions.map((transaction, index) => (
                  <tr key={index} className={transaction.type === 'Credit' ? 'text-green-500' : 'text-red-500'}>
                    <td className="p-3">{transaction.date}</td>
                    <td className="p-3">{transaction.time}</td>
                    <td className="p-3">{transaction.type}</td>
                    <td className="p-3">{transaction.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cash In Modal */}
      {showCashInModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className='flex justify-between'>
              <h1 className="text-3xl mb-4">Cash In </h1>
              <button onClick={handleCloseCashInModal} className="w-8 h-8 bg-red-400 text-white rounded-md hover:bg-red-600">
                X
              </button>
            </div>
            <input
              type="number"
              placeholder="Enter amount"
              value={cashInAmount}
              onChange={(e) => setCashInAmount(e.target.value)}
              className="w-full rounded-md border border-gray-400 p-2 focus:outline-none focus:border-blue-500 mb-4"
            />
            <button onClick={handleCashInSubmit} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
