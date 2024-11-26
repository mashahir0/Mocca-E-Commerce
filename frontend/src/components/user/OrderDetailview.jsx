

  import React from "react";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import axios from "../../services/api/userApi";
  import { useSelector } from "react-redux";
  import { useParams } from "react-router-dom";
  
  function OrderDetailView() {
    const { user } = useSelector((state) => state.user);
    const userId = user.id; // Assuming `user.id` contains the logged-in user's ID
  
    // Get the orderId from the URL using useParams
    const { id } = useParams();
    const orderId = id;
  
    // Function to handle cancellation of the product
    const cancelProduct = async ({ productId, orderId }) => {
      try {
        const response = await axios.put(`/cancel-order/${userId}/${orderId}`, { productId });
        return response.data; // Return response data to use in onSuccess
      } catch (error) {
        throw new Error("Failed to cancel product");
      }
    };
  
    // Fetch order details using React Query based on orderId
    const { data: order, isLoading, isError } = useQuery({
      queryKey: ["orderDetails", orderId],  // Use orderId here to fetch the specific order
      queryFn: async () => {
        const response = await axios.get(`/order-details-view/${userId}/${orderId}`);
        return response.data;
      },
    });
  
    // Use QueryClient to access cache and invalidate the query
    const queryClient = useQueryClient();
  
    // Mutation to handle canceling the product
    const { mutate, isLoading: isMutating, isError: isMutationError } = useMutation({
      mutationFn: cancelProduct,
      onSuccess: (data) => {
        console.log("Product cancelled successfully:", data);
  
        // Update only the specific cancelled product in the cache
        queryClient.setQueryData(["orderDetails", userId], (oldData) => {
          const updatedOrders = oldData.map((order) => {
            if (order._id === data.order._id) {
              // Update only the cancelled product
              order.products = order.products.map((product) => {
                if (product.productId._id === data.order.products[0].productId._id) {
                  product.status = "Cancelled"; // Update the status of the cancelled product
                }
                return product;
              });
            }
            return order;
          });
          return updatedOrders;
        });
      },
      onError: (error) => {
        console.error("Error cancelling product:", error);
      },
    });
  
    if (isLoading) {
      return <p>Loading order details...</p>;
    }
  
    if (isError) {
      return <p className="text-red-500">Failed to load order details. Please try again later.</p>;
    }
  
    if (!order) {
      return <p className="text-center text-gray-500">No order details available.</p>;
    }
  
    return (
      <div className="max-w-5xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg text-gray-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">Order Details</h2>
          <p className="text-sm text-gray-500">Order ID: {order?._id}</p>
          <p className="text-sm text-gray-500">
            Order Date: {new Date(order?.orderDate).toLocaleDateString()}
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
            <p className="text-sm">
              <strong>Name:</strong> {order?.address?.name}
            </p>
            <p className="text-sm">
              <strong>Address:</strong>{" "}
              {`${order?.address?.houseno}, ${order?.address?.street}, ${order?.address?.landmark}`}
            </p>
            <p className="text-sm">
              <strong>City:</strong>{" "}
              {`${order?.address?.town}, ${order?.address?.city}, ${order?.address?.state}`}
            </p>
            <p className="text-sm">
              <strong>Pincode:</strong> {order?.address?.pincode}
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {order?.address?.phone}
            </p>
          </div>
  
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <p className="text-sm">
              <strong>Total Amount:</strong> ₹{order?.totalAmount}
            </p>
            <p className="text-sm">
              <strong>Total Items:</strong> {order?.products?.length}
            </p>
            <p className="text-sm">
              <strong>Delivery Status:</strong>{" "}
              <span
                className={`font-bold ${
                  order?.orderStatus === "Delivered" ? "text-green-500" : "text-red-500"
                }`}
              >
                {order?.orderStatus}
              </span>
            </p>
            <p className="text-sm">
              <strong>Payment Method:</strong> {order?.paymentMethod}
            </p>
            <p className="text-sm">
              <strong>Payment Status:</strong>{" "}
              <span
                className={`font-bold ${
                  order?.paymentStatus === "Completed" ? "text-green-500" : "text-red-500"
                }`}
              >
                {order?.paymentStatus}
              </span>
            </p>
          </div>
        </div>
  
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Ordered Products</h3>
          <div className="space-y-4">
            {order?.products?.map((product) => (
              <div
                key={product.productId._id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center">
                  <img
                    src={product.productId.mainImage}
                    alt={product.productId.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{product.productId.productName}</h4>
                    <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                    <p className="text-sm text-gray-500">Price: ₹{product.productId.salePrice}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {/* If the order is cancelled, show "Item Cancelled" for all products */}
                  {order?.orderStatus === "Cancelled" || product.status === "Cancelled" ? (
                    <span className="text-sm text-red-500">Item Cancelled</span>
                  ) : order?.orderStatus === "Delivered" && product.status !== "Cancelled" ? (
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      // Handle return logic here, if any
                      onClick={() => alert("Return Item functionality here")}
                    >
                      Return Item
                    </button>
                  ) : (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => mutate({ productId: product.productId._id, orderId: order._id })}
                      disabled={isMutating}
                    >
                      {isMutating ? "Cancelling..." : "Cancel Item"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default OrderDetailView;
  
  