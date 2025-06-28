import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SummaryApi from '../common/SummaryApis'; // Your API config file
import axios from 'axios';

// Helper function to get styling for status badges
const getStatusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Myorder = () => {
  const user = useSelector((state) => state?.user);
  const userId = user?._id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await axios({
            ...SummaryApi.getorderhistory,
            data: { userId }
          });

          if (response.data.success) {
            // Set orders directly from the API response. NO MOCK DATA.
            setOrders(response.data.data);
          } else {
            toast.error(response.data.message || "Failed to fetch orders");
          }
        } catch (err) {
          toast.error(err.message || "An error occurred");
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setLoading(false); // No user, so not loading
    }
  }, [userId]);

  // Filter orders into two groups based on delivery_status
  const completedOrders = orders.filter(order => order.delivery_status === 'delivered');
  const ongoingOrders = orders.filter(order => order.delivery_status !== 'delivered');

  // Render a loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">My Orders</h1>

      {/* Main container for order sections */}
      <div className="space-y-10">

        {/* --- 1. COMPLETED DELIVERIES SECTION --- */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Completed Deliveries</h2>
          {completedOrders.length > 0 ? (
            <div className="space-y-4">
              {completedOrders.map(order => (
                order.productId.map(product => (
                  <div key={product._id} className="flex items-center space-x-4 rounded-md bg-gray-50 p-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-16 w-16 flex-shrink-0 rounded-md bg-gray-200 object-cover"
                    />
                    <p className="font-medium text-gray-700">{product.name}</p>
                  </div>
                ))
              ))}
            </div>
          ) : (
            // Message shown when there are no completed orders
            <p className="text-gray-500">You have no completed orders yet.</p>
          )}
        </div>

        {/* --- 2. ACTIVE ORDERS SECTION --- */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Active Orders</h2>
          {ongoingOrders.length > 0 ? (
            <div className="space-y-8">
              {ongoingOrders.map((order) => (
                <div key={order._id} className="overflow-hidden rounded-lg bg-white shadow-md">
                  {/* Order Header */}
                  <div className="flex flex-col items-start justify-between gap-2 border-b bg-gray-50 p-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Order ID: <span className="font-normal text-indigo-600">{order._id}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Order Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  </div>

                  {/* Order Body with Status */}
                  <div className="p-4">
                    <div className="mb-4 flex flex-wrap gap-x-6 gap-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-500">Payment Method</p>
                        <p className="font-semibold text-gray-800">{order.paymentMethod.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-500">Delivery Status</p>
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusClasses(order.delivery_status)}`}>
                          {order.delivery_status}
                        </span>
                      </div>
                    </div>
                    <h4 className="mb-2 text-md font-semibold text-gray-600">Items:</h4>
                    <ul className="divide-y divide-gray-200">
                      {order.productId.map((product) => (
                        <li key={product._id} className="flex items-center space-x-4 py-3">
                          <img src={product.images[0]} alt={product.name} className="h-16 w-16 rounded-md bg-gray-200 object-cover" />
                          <span className="font-medium text-gray-700">{product.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 border-t bg-gray-50 p-4">
                    <button type="button" className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600">Cancel Order</button>
                    {order.paymentMethod.toLowerCase() === 'cod' && (
                      <button type="button" className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700">Confirm Delivery</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Message shown when there are no active orders
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-gray-500">You have no active orders right now.</p>
            </div>
          )}
        </div>

        {/* Final check: if no orders of any kind exist, show a primary empty message */}
        {orders.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">No Order History</h3>
            <p className="mt-2 text-gray-500">Start shopping to see your orders here!</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Myorder;