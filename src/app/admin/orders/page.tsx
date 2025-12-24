"use client";

import { useState } from "react";
import AdminNav from "@/components/layout/AdminNav";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { orders } from "@/lib/mockData";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState("all");

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Order Management</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "pending", "paid", "shipped", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === status
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted hover:text-text-primary"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-text-muted/10">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Order #</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Payment</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-text-muted/10">
                    <td className="py-3 px-4 text-text-primary font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-text-primary">{order.shippingInfo.name}</p>
                        <p className="text-sm text-text-muted">{order.shippingInfo.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-text-primary font-semibold">
                      ฿{order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-text-muted">{order.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <select
                        className="bg-surface border border-text-muted/20 rounded px-3 py-1 text-sm text-text-primary"
                        defaultValue={order.status}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-sm text-primary hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
