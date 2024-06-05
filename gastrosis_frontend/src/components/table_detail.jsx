import React from 'react';

const TableDetail = ({ TableNum, TableColor, TableCapacity, TableStatus, onClick }) => {
  const bgColor = {
    Empty: "bg-blue-500",
    Full: "bg-red-500",
    Reserved: "bg-yellow-500"
  }[TableColor] || "bg-gray-500"; // Default color

  return (
    <div className={`${bgColor} p-6 hover:bg-[#003C43] h-44 rounded-xl shadow-lg cursor-pointer`} onClick={onClick}>
      <h1 className="text-white text-2xl font-semibold">Table - {TableNum}</h1>
      <h1 className="text-white text-md">Status - {TableStatus}</h1>
      <h1 className="text-white text-md">Capacity - {TableCapacity}</h1>
    </div>
  );
};

export default TableDetail;
