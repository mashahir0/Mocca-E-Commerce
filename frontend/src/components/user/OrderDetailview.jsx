

  // import React from "react";
  // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  // import axios from "../../services/api/userApi";
  // import { useSelector } from "react-redux";
  // import { useParams } from "react-router-dom";
  // import { useNavigate } from "react-router-dom";
  
  // function OrderDetailView() {
  //   const { user } = useSelector((state) => state.user);
  //   const userId = user.id; 
  //   const navigate = useNavigate()
  
    
  //   const { id } = useParams();
  //   const orderId = id;
  
   
  
  //   // Fetch order details using React Query based on orderId
  //   const { data: order, isLoading, isError } = useQuery({
  //     queryKey: ["orderDetails", orderId],  
  //     queryFn: async () => {
  //       const response = await axios.get(`/order-details-view/${userId}/${orderId}`);
  //       return response.data;
  //     },
  //   });
  
  //   // Use QueryClient to access cache and invalidate the query
  //   const queryClient = useQueryClient();
  
    
  //   const { mutate, isLoading: isMutating } = useMutation({
  //     mutationFn: async ({ productId }) => {
  //       const response = await axios.put(`/cancel-order/${userId}/${id}`, { productId });
  //       return response.data; // Response contains the updated order data
  //     },
  //     onSuccess: () => {
  //       // Invalidate the order details query to refetch updated data
  //       queryClient.invalidateQueries(["orderDetails", orderId]);
  //       alert('item canceled')
  //     },
  //     onError: (error) => {
  //       console.error("Error cancelling product:", error);
  //     },
  //   });
  
  //   if (isLoading) {
  //     return <p>Loading order details...</p>;
  //   }
  
  //   if (isError) {
  //     return <p className="text-red-500">Failed to load order details. Please try again later.</p>;
  //   }
  
  //   if (!order) {
  //     return <p className="text-center text-gray-500">No order details available.</p>;
  //   }
  
  //   return (
  //     <div className="max-w-5xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg text-gray-800">
  //       <div className="mb-6">
  //         <h2 className="text-2xl font-bold text-black">Order Details</h2>
  //         <p className="text-sm text-gray-500">Order ID: {order?._id}</p>
  //         <p className="text-sm text-gray-500">
  //           Order Date: {new Date(order?.orderDate).toLocaleDateString()}
  //         </p>
  //       </div>
  
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
  //         <div>
  //           <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
  //           <p className="text-sm">
  //             <strong>Name:</strong> {order?.address?.name}
  //           </p>
  //           <p className="text-sm">
  //             <strong>Address:</strong>{" "}
  //             {`${order?.address?.houseno}, ${order?.address?.street}, ${order?.address?.landmark}`}
  //           </p>
  //           <p className="text-sm">
  //             <strong>City:</strong>{" "}
  //             {`${order?.address?.town}, ${order?.address?.city}, ${order?.address?.state}`}
  //           </p>
  //           <p className="text-sm">
  //             <strong>Pincode:</strong> {order?.address?.pincode}
  //           </p>
  //           <p className="text-sm">
  //             <strong>Phone:</strong> {order?.address?.phone}
  //           </p>
  //         </div>
  
  //         <div>
  //           <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            // <p className="text-sm">
            //   <strong>Total Amount:</strong> ₹{order?.totalAmount}
            // </p>
            // <p className="text-sm">
            //   <strong>Total Items:</strong> {order?.products?.length}
            // </p>
            // <p className="text-sm">
            //   <strong>Delivery Status:</strong>{" "}
            //   <span
            //     className={`font-bold ${
            //       order?.orderStatus === "Delivered" ? "text-green-500" : "text-red-500"
            //     }`}
            //   >
            //     {order?.orderStatus}
            //   </span>
            // </p>
            // <p className="text-sm">
            //   <strong>Payment Method:</strong> {order?.paymentMethod}
            // </p>
            // <p className="text-sm">
            //   <strong>Payment Status:</strong>{" "}
            //   <span
            //     className={`font-bold ${
            //       order?.paymentStatus === "Completed" ? "text-green-500" : "text-red-500"
            //     }`}
            //   >
            //     {order?.paymentStatus}
            //   </span>
            // </p>
          //</div>
  //       </div>
  
  //       <div className="mb-6">
  //         <h3 className="text-lg font-semibold mb-2">Ordered Products</h3>
  //         <div className="space-y-4">
  //           {order?.products?.map((product) => (
  //             <div
  //               key={product.productId._id}
  //               className="flex items-center justify-between border-b pb-4"
                
  //             >
  //               <div className="flex items-center">
  //                 <img
  //                   src={product.productId.mainImage}
  //                   alt={product.productId.name}
  //                   className="w-20 h-20 object-cover rounded-md mr-4"
  //                   onClick={()=>navigate(`/productinfo/${product.productId._id}`)}
  //                 />
  //                 <div>
  //                   <h4 className="font-semibold">{product.productId.productName}</h4>
  //                   <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
  //                   <p className="text-sm text-gray-500">Price: ₹{product.productId.salePrice}</p>
  //                 </div>
  //               </div>
  //               <div className="flex flex-col items-end">
  //                 {/* If the order is cancelled, show "Item Cancelled" for all products */}
  //                 {order?.orderStatus === "Cancelled" || product.status === "Cancelled" ? (
  //                   <span className="text-sm text-red-500">Item Cancelled</span>
  //                 ) : order?.orderStatus === "Delivered" && product.status !== "Cancelled" ? (
  //                   <button
  //                     className="text-blue-500 hover:text-blue-700"
  //                     // Handle return logic here, if any
  //                     onClick={() => alert("Return Item functionality here")}
  //                   >
  //                     Return Item
  //                   </button>
  //                 ) : (
  //                   <button
  //                     className="text-red-500 hover:text-red-700"
  //                     onClick={() => mutate({ productId: product.productId._id, orderId: order._id })}
  //                     disabled={isMutating}
  //                   >
  //                     {isMutating ? "Cancelling..." : "Cancel Item"}
  //                   </button>
  //                 )}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  
  // export default OrderDetailView;
  
  import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function OrderDetailView() {
  const { user } = useSelector((state) => state.user);
  const userId = user.id;
  const navigate = useNavigate();

  const { id } = useParams();
  const orderId = id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [returnReason, setReturnReason] = useState("");

  // Fetch order details using React Query based on orderId
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: async () => {
      const response = await axios.get(`/order-details-view/${userId}/${orderId}`);
      return response.data;
    },
  });

  // Use QueryClient to access cache and invalidate the query
  const queryClient = useQueryClient();

  // Mutation to handle return
  const { mutate: returnProduct, isLoading: isReturning } = useMutation({
    mutationFn: async ({ productId, reason }) => {
      const response = await axios.put(`/return-order/${userId}/${orderId}`, { productId, reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orderDetails", orderId]);
      alert("Item returned successfully");
      setIsModalOpen(false);
      setReturnReason("");
    },
    onError: (error) => {
      console.error("Error returning product:", error);
    },
  });

  const handleReturnClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleSendReturn = () => {
    if (!returnReason.trim()) {
      alert("Please provide a reason for return.");
      return;
    }
    returnProduct({ productId: selectedProductId, reason: returnReason });
  };

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

      {/* Modal for return reason */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reason for Return</h3>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows="4"
              placeholder="Enter the reason for return"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={handleSendReturn}
                disabled={isReturning}
              >
                {isReturning ? "Submitting..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
          {/* Shipping details */}
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
          {/* Order summary */}
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
                  onClick={() => navigate(`/productinfo/${product.productId._id}`)}
                />
                <div>
                  <h4 className="font-semibold">{product.productId.productName}</h4>
                  <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                  <p className="text-sm text-gray-500">Price: ₹{product.productId.salePrice}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {order?.orderStatus === "Delivered" && product.status !== "Cancelled" ? (
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleReturnClick(product.productId._id)}
                  >
                    Return Item
                  </button>
                ) : (
                  <span className="text-sm text-red-500">
                    {product.status === "Cancelled" ? "Item Cancelled" : "Not Returnable"}
                  </span>
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
