import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import AccordionItem from '../components/acordion_item';

function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/orderpage`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = await response.json();
      console.log(res)
      setOrders(res);
      console.log(orders)
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/backgroundpic.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative text-center">
        <Navbar></Navbar>
        <div className='flex justify-center'>
        <div className='container justify-center'>
          <div>
            <div>
              <div className='container grid bg-white bg-opacity-80 px-8 py-8 justify-start rounded-lg my-4'>
                <h1 className='font-medium text-2xl text-left'>Welcome, Yasin</h1>
                <p className='font-medium text-sm text-left'>This is your dashboard to manage tables.</p>
              </div>
            </div>
            <div className='container bg-white bg-opacity-80 py-4 px-8 rounded-xl'>
              <h1 className='text-lg font-medium'>Orders</h1>
              <hr className=''></hr>
              <div className="overflow-x-auto">
                <div className='p-4 grid grid-cols-1 gap-2'>
                  {orders.map((order, index) => (
                    <AccordionItem key={index} order={order} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;