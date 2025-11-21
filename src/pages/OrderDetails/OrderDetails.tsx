import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api_url } from "../../utils/ApiClient";
import Alert from "../../components/Alert";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api_url}/orders/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      const result = await response.json();
      setOrder(result.data);
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: "Failed to load order details" });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`${api_url}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setAlert({
        type: "success",
        message: "Order status updated successfully!",
      });
      fetchOrder();
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: "Failed to update order status" });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-indigo-100 text-indigo-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="mb-4">
        <button
          onClick={() => navigate("/orders")}
          className="text-purple-500 hover:text-purple-700 font-medium"
        >
          ← Back to Orders
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Order Details
              </h2>
              <p className="text-lg text-gray-600">{order.orderNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                className={`px-4 py-2 border-2 rounded-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent ${getStatusColor(
                  order.status
                )}`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-base font-medium text-gray-900">
                {order.firstName} {order.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-900">
                {order.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium text-gray-900">
                {order.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-base font-medium text-gray-900">
                {order.streetAddress}, {order.city}, {order.state}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Items
          </h3>
          <div className="space-y-4">
            {order.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-4 border rounded-lg p-4"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {item.productName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Color: {item.color} | Size: {item.size}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-gray-900">${item.price}</p>
                  <p className="text-sm text-gray-500 mt-1">Subtotal</p>
                  <p className="font-semibold text-gray-900">
                    ${item.subtotal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium text-gray-900">
                {order.totalItems}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                ${order.totalPrice}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Fee</span>
              <span className="font-medium text-gray-900">
                ${order.shippingFee}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-lg font-semibold text-gray-800">
                Final Total
              </span>
              <span className="text-lg font-bold text-purple-600">
                ${order.finalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Order Date */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-gray-500">
            Order Date:{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
