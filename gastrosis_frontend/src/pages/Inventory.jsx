import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [purchasedStock, setPurchasedStock] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddItem(name, quantity);
    setModalOpen(false);
  };

  const fetchInventory = async () => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/inventory`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = await response.json();
      setInventory(res);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (ItemName, Quantity) => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/inventory/additem`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ItemName: ItemName, Quantity: parseInt(Quantity) }),
      });
      const addedItem = await response.json();
      setInventory([...inventory, addedItem]);
      setName('');
      setQuantity('');
      setIsPopupOpen(false);
      fetchInventory();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteClick = async (index) => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/inventory/deleteitem`
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({InventoryID: inventory[index].InventoryID}),
      });
      setInventory(inventory.filter((_, i) => i !== index));
      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/backgroundpic.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className='relative text-center'>
        <Navbar />
        <div className='flex justify-center'>
          <div className='container grid bg-white bg-opacity-100 px-8 py-8 justify-start rounded-lg my-4'>
            <h1 className='font-medium text-2xl text-left'>Welcome, Yasin</h1>
            <p className='font-medium text-sm text-left'>This is your dashboard to manage tables.</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="container bg-white bg-opacity-80 p-4 rounded-lg my-4">
            <div className="w-full text-sm text-left rtl:text-right text-gray-500">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-black uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Quantity</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{item.ItemName}</td>
                      <td className="px-6 py-4">{item.Quantity}</td>
                      <td className="px-6 py-4">
                        <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => handleDeleteClick(index)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td colSpan="3" className="px-6 py-4 text-center">No inventory available</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <br />
              <div className='flex justify-center'>
                <button
                  type="button"
                  className="edit-button text-white bg-green-700 hover:bg-lightgreen-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={toggleModal}
                >
                  Add
                </button>
              </div>

              {modalOpen && (
                <div
                  id="crud-modal"
                  tabIndex="-1"
                  aria-hidden="true"
                  className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
                >
                  <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Create New Product
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                          onClick={toggleModal}
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

                      <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4 mb-4 grid-cols-2">
                          <div className="col-span-2">
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Type product name"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
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
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter quantity"
                              required
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className='flex justify-center'>
                          <button
                            type="submit"
                            className="edit-button text-white bg-green-700 hover:bg-lightgreen-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                          >
                            Add new product
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
