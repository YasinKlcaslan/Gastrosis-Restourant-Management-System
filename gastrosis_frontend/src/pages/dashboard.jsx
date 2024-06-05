import React from 'react';
import Navbar from './Navbar';
import Table from '../components/Table';

function Dashboard() {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/backgroundpic.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative text-center">
        <Navbar></Navbar>
        <div className='flex justify-center'>
          <div className='container grid bg-white bg-opacity-80 px-8 py-8 justify-start rounded-lg my-4'>
            <h1 className='font-medium text-2xl text-left'>Welcome, Yasin</h1>
            <p className='font-medium text-sm text-left'>This is your dashboard to manage tables.</p>
          </div>
        </div>

        <div className='flex justify-center'>
          <div className='container bg-white bg-opacity-80 py-4 px-8 rounded-xl'>
            <h1 className='text-lg font-medium'>Tables</h1>
            <hr className=''></hr>
            <Table />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
