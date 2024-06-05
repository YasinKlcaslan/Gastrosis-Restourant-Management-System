import React, { useState, useEffect } from 'react';
import MenuItems from '../components/menu_items';
import Navbar from './Navbar';
import Add_button from '../components/menu/add_button';

function Menu() {
  const [data, setData] = useState([]);

  const MenuFunction = async () => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/menu`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const res = await response.json();
      setData(res);
      console.log(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    MenuFunction();
  }, []);

  return (
    <div className=" min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/backgroundpic.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className='relative text-center'>
        <Navbar></Navbar>
        <div className='flex justify-center'>
          <div className='container grid bg-white bg-opacity-80 px-8 py-8 justify-start rounded-lg my-4'>
            <h1 className='font-medium text-2xl text-left'>Welcome, Yasin</h1>
            <p className='font-medium text-sm text-left'>This is your dashboard to manage tables.</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center justify-center p-4 my-4 bg-white rounded-lg">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 m-5 w-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                {data.map((val, index) => (<MenuItems ItemName={val.Name} ItemDescription={val.Description} ItemPrice={val.Price} ItemCategory={val.Category} ItemID={val.MenuItemID} />))}
              </table>
              <div className="flex justify-center">
                <Add_button></Add_button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
