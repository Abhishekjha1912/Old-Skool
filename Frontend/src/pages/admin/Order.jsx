import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { toast } from 'react-toastify';
import { io } from "socket.io-client";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  withCredentials: true
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editOrderId, setEditOrderId] = useState(null);
  const [editTotal, setEditTotal] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, orderStatus) => {
    try {
      await API.put(`/orders/${id}/status`, { status: orderStatus });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await API.delete(`/orders/${id}`);
        toast.success("Order deleted successfully");
        fetchOrders();
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete order");
      }
    }
  };

  const startEdit = (order) => {
    setEditOrderId(order._id);
    setEditTotal(order.totalAmount);
  };

  const cancelEdit = () => {
    setEditOrderId(null);
    setEditTotal(0);
  };

  const saveEdit = async (id) => {
    try {
      const payload = { totalAmount: Number(editTotal) };
      await API.put(`/orders/${id}`, payload);
      toast.success("Order updated successfully");
      setEditOrderId(null);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    }
  };

  useEffect(() => {
    fetchOrders();
    socket.on("orderUpdated", fetchOrders);
    return () => socket.off("orderUpdated");
  }, []);

  // Filter orders by status
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === statusFilter);

  const statusColors = {
    placed: "bg-blue-100 text-blue-800",
    preparing: "bg-yellow-100 text-yellow-800",
    ready: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">📦 Orders Management</h2>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter("placed")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === "placed"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Placed
          </button>
          <button
            onClick={() => setStatusFilter("preparing")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === "preparing"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setStatusFilter("ready")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === "ready"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => setStatusFilter("delivered")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === "delivered"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading && filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-orange-500">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">
                    Customer: <span className="font-semibold">{order.user?.name || "Unknown"}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: <span className="font-semibold">{order.user?.email}</span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    statusColors[order.orderStatus] || "bg-gray-100"
                  }`}
                >
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>

              {/* Order Items */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Items:</h4>
                <ul className="space-y-1">
                  {order.items.map((i, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex justify-between">
                      <span>
                        {i.menuItem?.name} <span className="text-gray-500">× {i.quantity}</span>
                      </span>
                      <span className="font-medium">₹{(i.menuItem?.price * i.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">📍 Delivery Address:</h4>
                  <p className="text-sm text-gray-700">
                    {order.address.street || order.address}
                  </p>
                </div>
              )}

              {/* Total & Status Update */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    {editOrderId === order._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editTotal}
                          onChange={(e) => setEditTotal(e.target.value)}
                          className="w-32 px-2 py-1 border rounded"
                        />
                        <button onClick={() => saveEdit(order._id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                        <button onClick={cancelEdit} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <p className="text-2xl font-bold text-orange-600">₹{order.totalAmount.toFixed(2)}</p>
                        <button onClick={() => startEdit(order)} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Edit</button>
                      </div>
                    )}
                  </div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="placed">Placed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete order"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </div>

              {/* Timestamp */}
              <p className="text-xs text-gray-500 mt-3">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
