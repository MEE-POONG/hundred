"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { orders } from "@/lib/mockData";
import { Order } from "@/types";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "shipped":
        return "primary";
      case "paid":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Order History</h1>
        <p className="text-text-muted mb-8">View and track your orders</p>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-text-muted mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No orders yet</h2>
            <p className="text-text-muted">Your order history will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-1">
                      Order {order.orderNumber}
                    </h3>
                    <p className="text-sm text-text-muted">
                      Placed on {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-text-muted/10 pt-4 mb-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-text-muted">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="text-text-primary">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-text-muted">
                        +{order.items.length - 2} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-xl font-bold text-primary">
                    Total: ฿{order.total.toLocaleString()}
                  </div>
                  <button
                    className="btn-outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {new Date(selectedOrder.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={getStatusVariant(selectedOrder.status)}>
                  {getStatusLabel(selectedOrder.status)}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-3">Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-3 bg-surface rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{item.product.name}</p>
                      <p className="text-sm text-text-muted">
                        Quantity: {item.quantity} × ฿{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="font-semibold text-text-primary">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-3">Shipping Information</h4>
              <div className="p-4 bg-surface rounded-lg space-y-1 text-sm">
                <p className="text-text-primary">{selectedOrder.shippingInfo.name}</p>
                <p className="text-text-muted">{selectedOrder.shippingInfo.email}</p>
                <p className="text-text-muted">{selectedOrder.shippingInfo.phone}</p>
                <p className="text-text-muted">{selectedOrder.shippingInfo.address}</p>
                <p className="text-text-muted">
                  {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.postalCode}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-3">Payment Method</h4>
              <div className="p-4 bg-surface rounded-lg text-sm">
                <p className="text-text-primary">{selectedOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="border-t border-text-muted/10 pt-4">
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>฿{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Shipping</span>
                  <span>
                    {selectedOrder.shipping === 0
                      ? "Free"
                      : `฿${selectedOrder.shipping.toLocaleString()}`}
                  </span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount</span>
                    <span>-฿{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span className="text-text-primary">Total</span>
                <span className="text-primary">฿{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
