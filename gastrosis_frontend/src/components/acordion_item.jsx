import React, { useState } from 'react';

const AccordionItem = ({ order }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div >
            <h2 id={`accordion-collapse-heading-${order.orderID}`}>
                <button
                    type="button"
                    className={` items-center gap-4 justify-between w-full p-5 bg-white font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200  focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 gap-3 ${isOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
                    data-accordion-target={`#accordion-collapse-body-${order.orderID}`}
                    aria-expanded={isOpen}
                    aria-controls={`accordion-collapse-body-${order.orderID}`}
                    onClick={toggleAccordion}
                >
                    <div className=' grid grid-cols-4 p-1 justify-between justify-items-start'>
                        <span className='justify-self-start '>Table: {order.tableName} </span>
                        <span className='justify-self-start '>Order Time: {order.orderTime}</span>
                        <span></span>
                        <svg
                            data-accordion-icon
                            className={`w-3 h-3 shrink-0 self-center justify-self-end transform ${isOpen ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5 5 1 1 5"
                            />
                        </svg>
                    </div>
                </button>
            </h2>

            <div
                id={`accordion-collapse-body-${order.orderID}`}
                className={`${isOpen ? 'block' : 'hidden'}`}
                aria-labelledby={`accordion-collapse-heading-${order.orderID}`}
            >
                <div className="p-5 bg-white border border-b-0 rounded-b-xl border-gray-200 ">
                    <table className="w-full table-auto text-md text-left bg-gray-100 text-md text-gray-500">
                            <thead className='text-sm bg-gray-50 uppercase'>
                                <tr>
                                    <th className="px-4 py-2">Menu Item Name</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Price</th>
                                </tr>
                            </thead>
                        <tbody>
                            {order.details.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50 hover:font-semibold'>
                                    <td className="px-4 py-2">{item.menuItemName}</td>
                                    <td className="px-4 py-2">x{item.quantity}</td>
                                    <td className="px-4 py-2">{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex p-5 rounded-xl mt-5 justify-between bg-gray-100'>
                        <span>
                            {`Employee: ${order.employeeName}`}
                        </span>
                        <span>
                            {`Total Amount: ${order.totalAmount} ₺`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccordionItem;
