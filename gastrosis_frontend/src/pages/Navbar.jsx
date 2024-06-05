import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-center py-3 bg-white bg-opacity-80">
      <div className="container rounded-lg flex justify-between items-center">
        <a href='/dashboard' className="hover:bg-white bg-opacity-80 p-2 rounded-md">
          <img src="/logo.svg" alt="Logo" className="w-40" /> {/* Logoyu büyütüyoruz */}
        </a>
        <div className="space-x-4">
          <a href="/menu" className="font-medium hover:bg-white hover:bg-opacity-80  px-3 py-2 rounded">Menu</a> {/* Buton stilinde */}
          <a href="/orders" className="font-medium hover:bg-white hover:bg-opacity-80  px-3 py-2 rounded">Orders</a> {/* Buton stilinde */}
          <a href="/inventory" className="font-medium hover:bg-white hover:bg-opacity-80  px-3 py-2 rounded">Inventory</a> {/* Buton stilinde */}
          <a href="/shift" className="font-medium hover:bg-white hover:bg-opacity-80  px-3 py-2 rounded">Shift</a> {/* Buton stilinde */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
