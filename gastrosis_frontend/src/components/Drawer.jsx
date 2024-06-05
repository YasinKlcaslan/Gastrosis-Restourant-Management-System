import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Drawer = ({ isOpen, onClose, tableId, onOrderSubmit, menuItems, employees }) => {
  const [newOrder, setNewOrder] = useState({ menuItemId: 0, quantity: 1, employeeId: 0 });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(0);
  const [loading, isLoading] = useState(true);

  useEffect(() => {
    if (tableId) {
      fetchOrders(tableId)
    }
  }, [tableId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const fetchOrders = async (tableId) => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/orders`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
        })
      });
      const ordertable = await response.json();
      console.log(ordertable.success)
      if(ordertable.success){       
        setOrders(ordertable.result);
        setOrderId(ordertable.orderId)
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    finally { isLoading(false) }
  };
  const handleAddOrder = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const url = `https://gastrosis-backend.vercel.app/api/newproduct`;
      const response = await axios.post(url, {
        tableId: parseInt(tableId),
        menuItemId: parseInt(newOrder.menuItemId),
        quantity: parseInt(newOrder.quantity),
        employeeId: parseInt(newOrder.employeeId),
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchOrders(tableId);

    } catch (error) {
      console.error('Error adding order:', error);
    }
    setNewOrder({ menuItemId: '', quantity: 1, employeeId: '' });
  };

  const handleTotalAmount = () => {
    return orders.reduce((acc, order) => acc + (order.Price * order.Quantity), 0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    console.log(
      paymentMethod,
      handleTotalAmount(),
      orderId
    )
    try {
      const url = `https://gastrosis-backend.vercel.app/api/handlepayment`;
      const response = await axios.post(url, {
        paymentMethod: paymentMethod,
        orderId: parseInt(orderId),
        totalAmount:parseInt(handleTotalAmount()),
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const paymentResult = await response.json();
      console.log(paymentResult.message)
    } catch (error) {
      console.error('Error adding order:', error);
    }
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-gray-800 bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 bg-white w-96 p-4 overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Order
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <form className="p-4 md:p-5" onSubmit={handleAddOrder}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="menuItemId"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Menu Item
                </label>
                <select
                  id="menuItemId"
                  name="menuItemId"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  value={newOrder.menuItemId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Menu Item</option>
                  {menuItems.map(item => (
                    <option key={item.MenuItemID} value={item.MenuItemID}>{item.Name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="quantity"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  placeholder="1"
                  required
                  value={newOrder.quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="employeeId"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Employee
                </label>
                <select
                  id="employeeId"
                  name="employeeId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  value={newOrder.employeeId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.EmployeeID} value={employee.EmployeeID}>{employee.EmployeeName}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              + Add new product
            </button>
          </form>

          <div className="p-4 md:p-5">
            <div className="text-lg font-medium">Order Details</div>
            <hr className="my-2" />
            <div className="grid gap-4">
              {loading ?
                <>Yükleniyor</> :

                <div className='relative overflow-x-auto shadow-sm sm:rounded-md p-3'>
                  <table className='w-full text-md text-left rtl:text-right'>
                    <thead className='text-xs text-black uppercase bg-gray-50'>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </thead>
                    <tbody>
                      {orders.map((data, index) => (
                        <tr className='hover:bg-gray-300'>
                          <td>{data.Name}</td>
                          <td>x{data.Quantity}</td>
                          <td>{data.Price * data.Quantity}₺</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                Total Amount: {handleTotalAmount()}₺
              </div>
            </div>
            <form onSubmit={handlePayment}>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                >
                  <option value="">Select Payment Method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                </select>
                <br />
                <button
                  className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  type='submit'
                >
                  Complete Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
