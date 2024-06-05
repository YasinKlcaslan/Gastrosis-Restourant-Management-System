import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Shift = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        shiftFunction();
    }, []);

    const shiftFunction = async () => {
        try {
            const url = `https://gastrosis-backend.vercel.app/api/shift`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const res = await response.json();
            setEmployees(res);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const shiftEditFunction = async (employee) => {
        try {
            const url = `https://gastrosis-backend.vercel.app/api/shift/updateshift`;
            await axios.post(url, employee, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error editing:', error);
        }
    };
    const shiftDeleteFunction = async (employee) => {
        try {
            const url = `https://gastrosis-backend.vercel.app/api/shift/deleteshift`;
            await axios.post(url, employee, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            shiftFunction()
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const shiftAddFunction = async (employee) => {
        console.log(employee)
        try {
            const url = `https://gastrosis-backend.vercel.app/api/shift/addshift`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });
            shiftFunction()
        } catch (error) {
            console.error('Error adding:', error);
        }
    };


    const handleEditClick = (index) => {
        const updatedEmployees = [...employees];
        updatedEmployees[index].isEditing = true;
        setEmployees(updatedEmployees);
    };

    const handleSaveClick = async (index) => {
        const updatedEmployees = [...employees];
        updatedEmployees[index].isEditing = false;
        await shiftEditFunction(updatedEmployees[index]);
        setEmployees(updatedEmployees);
    };

    const handleAddClick = async (formData) => {
        const updatedEmployees = [...employees];
        await shiftAddFunction(formData);
        setEmployees([...updatedEmployees, formData]);
    };

    const handleFieldChange = (index, field, value) => {
        const updatedEmployees = [...employees];
        updatedEmployees[index][field] = value;
        setEmployees(updatedEmployees);
    };

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
                <div className="flex justify-center">
                    <div className="container bg-white bg-opacity-80 p-4 rounded-lg my-4">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead className="text-xs text-black uppercase bg-gray-50 ">
                                <tr>
                                    <th scope="col" className="px-6 py-3">First Name</th>
                                    <th scope="col" className="px-6 py-3">Last Name</th>
                                    <th scope="col" className="px-6 py-3">Phone</th>
                                    <th scope="col" className="px-6 py-3">Position</th>
                                    <th scope="col" className="px-6 py-3">Shift Start</th>
                                    <th scope="col" className="px-6 py-3">Shift End</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee, index) => (
                                    <tr key={employee.EmployeeID} className="bg-white border-b">
                                        <td className="px-6 py-4">
                                            {employee.isEditing ? (
                                                <input type="text" defaultValue={employee.FirstName} onChange={(e) => handleFieldChange(index, 'FirstName', e.target.value)} />
                                            ) : (
                                                employee.FirstName
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {employee.isEditing ? (
                                                <input type="text" defaultValue={employee.LastName} onChange={(e) => handleFieldChange(index, 'LastName', e.target.value)} />
                                            ) : (
                                                employee.LastName
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {employee.isEditing ? (
                                                <input type="text" defaultValue={employee.Phone} onChange={(e) => handleFieldChange(index, 'Phone', e.target.value)} />
                                            ) : (
                                                employee.Phone
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {employee.isEditing ? (
                                                <input type="text" defaultValue={employee.Position} onChange={(e) => handleFieldChange(index, 'Position', e.target.value)} />
                                            ) : (
                                                employee.Position
                                            )}
                                        </td>
                                        {employee.isEditing ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <input type="time" defaultValue={employee.ShiftStart} onChange={(e) => handleFieldChange(index, 'ShiftStart', e.target.value)} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input type="time" defaultValue={employee.ShiftEnd} onChange={(e) => handleFieldChange(index, 'ShiftEnd', e.target.value)} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="edit-button text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => handleSaveClick(index)}>Save</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">{employee.ShiftStart}</td>
                                                <td className="px-6 py-4">{employee.ShiftEnd}</td>
                                                <td className="px-6 py-4">
                                                    <button className="edit-button text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => handleEditClick(index)}>Edit</button>
                                                    <button
                                                        onClick={() => shiftDeleteFunction(employee)}
                                                        type="button"
                                                        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                        <div className="flex justify-center">
                            <button className="edit-button text-white bg-green-700 hover:bg-lightgreen-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => setIsPopupOpen(true)}>Add</button>
                            {isPopupOpen && (
                                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50">
                                    <div className="relative p-4 w-full max-w-md">
                                        <div className="relative bg-white rounded-lg shadow">
                                            <div className="flex items-center justify-between p-4 border-b rounded-t">
                                                <h3 className="text-lg font-semibold text-gray-900">Add</h3>
                                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={() => setIsPopupOpen(false)}>
                                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <AddEmployeeForm handleAddClick={handleAddClick} setIsPopupOpen={setIsPopupOpen} />
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

const AddEmployeeForm = ({ handleAddClick, setIsPopupOpen }) => {
    const [formData, setFormData] = useState({
        EmployeeID: 0,
        FirstName: '',
        LastName: '',
        Phone: '',
        Position: '',
        ShiftStart: '',
        ShiftEnd: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleAddClick(formData);
        setIsPopupOpen(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="FirstName" className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
                    <input type="text" name="FirstName" id="FirstName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="First Name" value={formData.FirstName} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="LastName" className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
                    <input type="text" name="LastName" id="LastName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Last Name" value={formData.LastName} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="Phone" className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
                    <input type="text" name="Phone" id="Phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Phone" value={formData.Phone} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="Position" className="block mb-2 text-sm font-medium text-gray-900">Position</label>
                    <select name="Position" id="Position" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Position" value={formData.Position} onChange={handleChange} required>
                        <option value="">Please Select</option>
                        <option value="Manager">Manager</option>
                        <option value="Waiter">Waiter</option>
                    </select>

                    {/* <input type="text" name="Position" id="Position" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Position" value={formData.Position} onChange={handleChange} required /> */}
                </div>
                <div>
                    <label htmlFor="ShiftStart" className="block mb-2 text-sm font-medium text-gray-900">Shift Start</label>
                    <input type="time" name="ShiftStart" id="ShiftStart" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Shift Start" value={formData.ShiftStart} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="ShiftEnd" className="block mb-2 text-sm font-medium text-gray-900">Shift End</label>
                    <input type="time" name="ShiftEnd" id="ShiftEnd" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Shift End" value={formData.ShiftEnd} onChange={handleChange} required />
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="flex justify-center edit-button text-white bg-green-700 hover:bg-lightgreen-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">Add</button>
                </div>
            </div>
        </form>
    );
};

export default Shift;
