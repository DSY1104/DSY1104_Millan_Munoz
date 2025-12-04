import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmCheckout, getOrderById } from "../services/cartService";
import { useCart } from "../context/CartContext";
import "/src/styles/pages/purchase-success.css";

export default function PaymentConfirm() {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const { clearCart } = useCart();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const confirmPayment = async () => {
         // Get token from URL query params
         const token = searchParams.get("token_ws");

         if (!token) {
            setError("Token de pago no encontrado");
            setLoading(false);
            return;
         }

         try {
            // Confirm checkout with Carrito Service
            const confirmResponse = await confirmCheckout(token);
            console.log("Payment confirmed:", confirmResponse);

            // Get stored checkout data
            const storedData = sessionStorage.getItem("pendingCheckout");
            let checkoutData = {};

            if (storedData) {
               checkoutData = JSON.parse(storedData);
               sessionStorage.removeItem("pendingCheckout");
            }

            // Get full order details
            const orderDetails = await getOrderById(confirmResponse.pedidoId);

            // Prepare order data for success page
            const orderData = {
               orderNumber: confirmResponse.numeroPedido,
               orderId: confirmResponse.pedidoId,
               orderDate: new Date().toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
               }),
               status: confirmResponse.estadoPedido,
               paymentMethod: "WebPay Plus (Transbank)",
               paymentStatus: confirmResponse.pago?.estadoPago,
               authorizationCode: confirmResponse.pago?.authorizationCode,
               shipping: checkoutData.shippingData || {},
               items: orderDetails.items || [],
               pricing: {
                  subtotal: orderDetails.totalProductos || 0,
                  discount: 0,
                  duocDiscount: 0,
                  total: orderDetails.totalProductos || 0,
               },
               pointsEarned: checkoutData.pointsEarned || 0,
               deliveryDate: calculateDeliveryDate(),
            };

            // Clear cart after successful payment
            await clearCart();

            // Navigate to success page
            navigate("/purchase-success", {
               state: { orderData },
               replace: true,
            });
         } catch (error) {
            console.error("Error confirming payment:", error);
            setError(error.response?.data?.message || error.message || "Error al confirmar el pago");
            setLoading(false);
         }
      };

      confirmPayment();
   }, [searchParams, navigate, clearCart]);

   const calculateDeliveryDate = () => {
      const meses = [
         "enero",
         "febrero",
         "marzo",
         "abril",
         "mayo",
         "junio",
         "julio",
         "agosto",
         "septiembre",
         "octubre",
         "noviembre",
         "diciembre",
      ];
      const deliveryDateObj = new Date();
      deliveryDateObj.setDate(deliveryDateObj.getDate() + 7);
      return `${deliveryDateObj.getDate()} de ${meses[deliveryDateObj.getMonth()]}`;
   };

   const handleRetry = () => {
      navigate("/cart");
   };

   const handleGoHome = () => {
      navigate("/");
   };

   if (loading) {
      return (
         <div className="purchase-success-page">
            <main className="purchase-success-main">
               <div className="purchase-success-container">
                  <div className="loading-spinner">
                     <div className="spinner"></div>
                     <h2>Confirmando tu pago...</h2>
                     <p>Por favor espera mientras procesamos tu transacción</p>
                  </div>
               </div>
            </main>
         </div>
      );
   }

   if (error) {
      return (
         <div className="purchase-success-page">
            <main className="purchase-success-main">
               <div className="purchase-success-container">
                  <div className="error-header">
                     <div className="error-icon">✕</div>
                     <h1 className="error-title">Error en el Pago</h1>
                     <p className="error-message">{error}</p>
                  </div>

                  <div className="error-actions">
                     <button className="btn-primary" onClick={handleRetry}>
                        Volver al Carrito
                     </button>
                     <button className="btn-secondary" onClick={handleGoHome}>
                        Ir al Inicio
                     </button>
                  </div>
               </div>
            </main>
         </div>
      );
   }

   return null;
}
