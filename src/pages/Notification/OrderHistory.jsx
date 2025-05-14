import { useState } from 'react';
import { Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectInitializeData } from '../../slice/patient-detail-form';

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState('All');
  const initialData = useSelector(selectInitializeData);

  console.log('initialDataDDDDD', initialData?.program_data?.
    applied_programs);
  // Sample data based on the provided structure
  const applied_programs = initialData?.program_data?.
  applied_programs || [];

  // Using the first program in the array for demonstration
  const programData = applied_programs[0];

  // Find an active order (for demonstration, using the first dispatched order as active)
  const activeOrder = [...programData.orders.paid_orders, ...programData.orders.foc_orders]
    .find(order => order.order_status === "Dispatched") || null;

  // Get all orders
  const allOrders = [
    ...programData.orders.paid_orders.map(order => ({
      ...order,
      type: 'Paid Order'
    })),
    ...programData.orders.foc_orders.map(order => ({
      ...order,
      type: 'Free Order'
    }))
  ];

  // Filter orders based on active tab
  const filteredOrders = 
    activeTab === 'All' ? allOrders :
    activeTab === 'Paid Orders' ? programData.orders.paid_orders.map(order => ({ ...order, type: 'Paid Order' })) :
    programData.orders.foc_orders.map(order => ({ ...order, type: 'Free Order' }));

  // Handle track order function
  const handleTrackOrder = (orderId) => {
    console.log('Tracking order:', orderId);
    // Add your tracking logic here
  };

  // Handle know more function
  const handleKnowMore = () => {
    console.log('User clicked on know more');
    // Add your logic here
  };

  return (
    <div className="max-w-md mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 font-sans text-black text-[20px]">Order History</h1>
      
      {activeOrder && (
        <div key={activeOrder.order_id} className="rounded-lg mb-4 border border-[#FBE2F0]">
          <div className="grid grid-cols-2 gap-[12px] p-3 mb-2">
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-[12px]">Order ID:</p>
              <p className="font-medium text-[12px]">{activeOrder.order_id}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-[12px]">Order Date:</p>
              <p className="font-medium text-[12px]">{activeOrder.order_date}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-[12px]">Order Type:</p>
              <span className={`px-2 py-[1px] text-xs rounded-md ${activeOrder.type === 'Paid Order' ? "bg-[#DDAA85] border text-white border-[#CE8551]" : "bg-[#F5C34D] text-white border border-[#F1AA00]"}`}>
                {activeOrder.type || (programData.orders.paid_orders.some(o => o.order_id === activeOrder.order_id) ? "Paid Order" : "Free Order")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-[12px]">Order Status:</p>
              <span className="text-[12px] text-[#55837F] font-medium font-sans">
                {activeOrder.order_status}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-[12px] text-gray-600 mt-2 p-2 gap-4 rounded-b-lg justify-between bg-[#FFF8FC]">
            <Info className="text-primary w-6 h-6" />
          
            {activeOrder.order_status === "Dispatched" ? (
              <p>
                Your order has been successfully dispatched, you can track your order here-
                <button 
                  onClick={() => handleTrackOrder(activeOrder.order_id)}
                  className="text-primary ml-1 font-medium"
                >
                  Track Order
                </button>
              </p>
            ) : (
              <p className="text-start">
                Please send your original invoice copy to so AZCares support center.
                <button 
                  onClick={handleKnowMore}
                  className="text-primary ml-1 font-medium"
                >
                  Know more
                </button>
              </p>
            )}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-[16px] font-semibold my-6 font-sans text-[#4F4F4F] ">Past Orders</h2>
        
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setActiveTab('All')}
            className={`rounded-[8px] px-3 py-[2px] border  text-[14px] font-sans ${activeTab === 'All' ? 'bg-[#FFF8FC] border-[#B75D91] text-[#7C084B]' : 'border-[#CBD5E1]'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('Paid Orders')}
            className={`rounded-[8px] px-2 py-[2px] border text-[14px] font-sans ${activeTab === 'Paid Orders' ? 'bg-[#FFF8FC] border-[#B75D91] text-[#7C084B]' : 'border-[#CBD5E1]'}`}
          >
            Paid Orders
          </button>
          <button 
            onClick={() => setActiveTab('Free Orders')}
            className={`rounded-[8px] px-2 py-[2px] border text-[14px] font-sans ${activeTab === 'Free Orders' ? 'bg-[#FFF8FC] border-[#B75D91] text-[#7C084B]' : 'border-[#CBD5E1]'}`}
          >
            Free Orders
          </button>
        </div>
        
        <div className="space-y-3">
          {filteredOrders
            .filter(order => activeOrder ? order.order_id !== activeOrder.order_id : true)
            .map((order, index) => (
              <div key={index} className="border border-[#FBE2F0] rounded-md ">
              <div className="grid grid-cols-2 gap-[12px] p-3 mb-2">
                <div className="flex items-center justify-start gap-2">
                  <p className="text-gray-500 text-[12px]">Order ID:</p>
                  <p className="font-medium text-[12px]">{order.order_id}</p>
                </div>
                <div className="flex items-center   justify-start gap-2">
                  <p className="text-gray-500 text-[12px]">Order Date:</p>
                  <p className="font-medium text-[12px]">{order.order_date}</p>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <p className="text-gray-500 text-[12px]">Order Type:</p>
                  <span className={`px-2 py-[1px] text-xs rounded-md ${order.type === 'Paid Order' ? "bg-[#DDAA85] text-white border border-[#CE8551]" : "bg-[#F5C34D] text-white border border-[#F1AA00]"}`}>
                    {order.type}
                  </span>
                </div>
                <div className="flex items-center  justify-start gap-2">
                  <p className="text-gray-500 text-[12px]">Order Status:</p>
                  <span className="text-[12px] text-[#55837F] font-medium font-sans">
                    {order.order_status}
                  </span>
                </div>
              </div>
            </div>
            
            ))}
        </div>
      </div>
    </div>
  );
}