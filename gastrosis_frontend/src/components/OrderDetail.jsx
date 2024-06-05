import React from 'react';

const OrderDetail = ({ order, index, employees, tables, menuItems, handleEditOrder, handleRemoveOrder, setSelectedOrderIndex, selected }) => {
    const handleStatusChange = (e) => {
        const status = e.target.value;
        handleEditOrder(index, status);
    };

    const calculateTotalAmount = () => {
        return order.MenuItems.reduce((total, menuItem) => total + menuItem.Price, 0);
    };

    return (
        <div
            className={`p-6 rounded-xl ${selected ? 'bg-yellow-300' : 'bg-green-500 hover:bg-[#003C43]'}`}
            onClick={() => setSelectedOrderIndex(index)}
            style={{ cursor: 'pointer' }}
        >
            <h1 className="text-white text-2xl">Order {order.OrderID}</h1>
            <select
                disabled={!selected}
                name="EmployeeID"
                value={order.EmployeeID}
                onChange={() => {}}
                className="block w-full mb-2 p-2 rounded"
            >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                    <option key={employee.EmployeeID} value={employee.EmployeeID}>
                        {employee.EmployeeName}
                    </option>
                ))}
            </select>
            <select
                disabled={!selected}
                name="TableID"
                value={order.TableID}
                onChange={() => {}}
                className="block w-full mb-2 p-2 rounded"
            >
                <option value="">Select Table</option>
                {tables.map((table) => (
                    <option key={table.TableID} value={table.TableID}>
                        {table.TableName}
                    </option>
                ))}
            </select>
            <div className="mb-2">
                <h3 className="text-white text-lg mb-2">Add Items</h3>
                <select
                    multiple
                    disabled={!selected}
                    name="MenuItems"
                    value={order.MenuItems.map((item) => item.MenuItemID)}
                    onChange={() => {}}
                    className="block w-full p-2 rounded"
                >
                    {menuItems.map((menuItem) => (
                        <option key={menuItem.MenuItemID} value={menuItem.MenuItemID}>
                            {menuItem.MenuItemName} - {menuItem.Price}
                        </option>
                    ))}
                </select>
            </div>
            <div className="text-white text-lg">
                Total Amount: {calculateTotalAmount()} TL
            </div>
            {(selected || order.OrderStatus !== 'New') && (
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-white text-lg mb-2">Order Status</h3>
                        <select
                            name="OrderStatus"
                            value={order.OrderStatus}
                            onChange={handleStatusChange}
                            className="block w-full p-2 rounded"
                        >
                            <option value="New">New</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded mr-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderIndex(index);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveOrder(index);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
