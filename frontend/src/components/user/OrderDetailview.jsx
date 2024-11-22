import React from "react";

function OrderDetailView({ order }) {
  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg text-gray-800">
      {/* Order Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Order Details</h2>
        <p className="text-sm text-gray-500">Order ID: {order?.id}</p>
        <p className="text-sm text-gray-500">Order Date: {order?.date}</p>
      </div>

      {/* Shipping and Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Shipping Details */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
          <p className="text-sm">
            <strong>Name:</strong> {order?.shipping?.name}
          </p>
          <p className="text-sm">
            <strong>Address:</strong> {order?.shipping?.address}
          </p>
          <p className="text-sm">
            <strong>City:</strong> {order?.shipping?.city}, {order?.shipping?.state}
          </p>
          <p className="text-sm">
            <strong>Pincode:</strong> {order?.shipping?.pincode}
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> {order?.shipping?.phone}
          </p>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <p className="text-sm">
            <strong>Total Amount:</strong> ${order?.totalAmount}
          </p>
          <p className="text-sm">
            <strong>Total Items:</strong> {order?.totalItems}
          </p>
          <p className="text-sm">
            <strong>Delivery Status:</strong>{" "}
            <span className={`font-bold ${order?.status === "Delivered" ? "text-green-500" : "text-red-500"}`}>
              {order?.status}
            </span>
          </p>
        </div>
      </div>

      {/* Ordered Product Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Ordered Products</h3>
        <div className="space-y-4">
          {order?.products?.map((product) => (
            <div key={product?.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{product?.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {product.quantity} | Price: ${product?.price}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold">${product?.price * product?.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <button className="w-full md:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-black/90">
          Return Item
        </button>
        <button className="w-full md:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-black/90">
          Cancel Order
        </button>
      </div>
    </div>
  );
}

export default OrderDetailView;
