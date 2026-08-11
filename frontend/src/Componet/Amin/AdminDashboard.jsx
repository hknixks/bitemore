import React, { useState } from 'react';
import ChartJs from '../../utils/ChartJs';
import { useSelector } from 'react-redux';
import useAdminAuthorization from '../../hooks/AdminAuth';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
    const { user } = useAdminAuthorization();

  const addOrder = () => {
    const newOrder = {
      id: orders.length + 1,
      tableNumber: Math.floor(Math.random() * 10) + 1,
      items: ['Burger', 'Pizza', 'Salad'],
      status: 'Pending',
    };
    setOrders([...orders, newOrder]);
  };

  const completeOrder = (id) => {
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status: 'Completed' } : order
    );
    setOrders(updatedOrders);
  };
  return (
    <>
      <div className="flex flex-col h-">
        <div className='container mx-auto px-10 '>
            <ChartJs />
          </div>
        <main className="flex-1 overflow-y-auto p-6">
          <section className="mb-8">
            <h2 className="text-xl mb-4">Orders</h2>
            <ul>
              {orders.map(order => (
                <li key={order.id} className="bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-center">
                  <div>
                    <p><strong>Table {order.tableNumber}</strong></p>
                    <p>Items: {order.items.join(', ')}</p>
                    <p>Status: {order.status}</p>
                  </div>
                  {order.status === 'Pending' && (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => completeOrder(order.id)}
                    >
                      Mark Complete
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={addOrder}
            >
              Add Order
            </button>
          </section>
        </main>
        <footer className="bg-gray-800 text-white py-4 px-6">
          <p>&copy; 2024 Your Restaurant</p>
        </footer>
      </div>
    </>
  )
}

export default AdminDashboard