import React, { useState, useEffect } from 'react';
import TableDetail from './table_detail';
import Drawer from './Drawer';
import axios from 'axios';

function Table() {
  const [data, setData] = useState([]);  
  const [menuItems, setMenuItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const TableFunction = async () => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/tables`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const res = await response.json();
      setData(res);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };



  const fetchMenuItems = async () => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/menu`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = await response.json();
      setMenuItems(res);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/employees`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = await response.json();
      setEmployees(res);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    TableFunction();
    fetchMenuItems();
    fetchEmployees();
  }, []);

  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
  };

  const handleOrderSubmit = async (tableId, newOrder) => {
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
  
      console.log('Server response:', response.data); // Log the response
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };
  

  const handlePayment = async (orderId, paymentType) => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/orders/payment`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderId: orderId,
            paymentType: paymentType
        })
      });
      const res = await response.json();
       // Refresh orders after updating payment status
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="container">
        <div className="grid grid-cols-4 gap-4 py-5">
          {data.map((val, index) => (
            <TableDetail 
              key={index}
              TableNum={val.Table_Name} 
              TableColor={val.TableStatus} 
              TableCapacity={val.SeatingCapacity} 
              TableStatus={val.OrderStatus}
              onClick={() => handleTableClick(val.TableID)}
            />
          ))}
        </div>
      </div>
      {selectedTable && (
        <Drawer
          isOpen={selectedTable !== null}
          onClose={() => setSelectedTable(null)}
          tableId={selectedTable}
          onOrderSubmit={handleOrderSubmit}
          onPayment={handlePayment}
          menuItems={menuItems}
          employees={employees}
        />
      )}
    </div>
  );
}

export default Table;
