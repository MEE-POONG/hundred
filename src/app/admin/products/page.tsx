"use client";

import { useState } from "react";
import AdminNav from "@/components/layout/AdminNav";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { products } from "@/lib/mockData";

export default function AdminProductsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Product Management</h1>
          <Button onClick={() => setShowAddModal(true)}>+ Add Product</Button>
        </div>

        <Card className="p-6 mb-6">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Card>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-text-muted/10">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-text-muted/10">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-background rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{product.name}</p>
                          <p className="text-sm text-text-muted">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-muted">{product.category}</td>
                    <td className="py-3 px-4 text-text-primary font-semibold">
                      ฿{product.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-text-primary">{product.stock}</td>
                    <td className="py-3 px-4">
                      <Badge variant={product.stock > 0 ? "success" : "danger"}>
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-sm text-primary hover:underline">Edit</button>
                        <button className="text-sm text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <form className="space-y-4">
          <Input label="Product Name" type="text" placeholder="Enter product name" />
          <Input label="Price" type="number" placeholder="0.00" />
          <Input label="Stock Quantity" type="number" placeholder="0" />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
            <select className="input-field">
              <option>Skin Health</option>
              <option>Gut Health</option>
              <option>Heart Health</option>
              <option>Immunity</option>
              <option>Energy</option>
            </select>
          </div>
          <div className="flex gap-4">
            <Button type="button" className="flex-1">
              Add Product
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
