"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = shippingMethod === "express" ? 150 : cart.length > 0 && getCartTotal() >= 1500 ? 0 : 50;
  const discount = 0;
  const total = getCartTotal() + shipping - discount;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const orderNumber = `NV-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(6, "0")}`;
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    clearCart();
    router.push("/account/orders");
  };

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-6">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Full Name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={errors.name}
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="081-234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={errors.phone}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      type="text"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      error={errors.address}
                    />
                  </div>
                  <Input
                    label="City"
                    type="text"
                    placeholder="Bangkok"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    error={errors.city}
                  />
                  <Input
                    label="Postal Code"
                    type="text"
                    placeholder="10110"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    error={errors.postalCode}
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-6">
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-text-muted/20 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-4 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">Standard Shipping</div>
                      <div className="text-sm text-text-muted">3-5 business days</div>
                    </div>
                    <div className="font-semibold text-text-primary">
                      {getCartTotal() >= 1500 ? "Free" : "฿50"}
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-text-muted/20 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-4 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">Express Shipping</div>
                      <div className="text-sm text-text-muted">1-2 business days</div>
                    </div>
                    <div className="font-semibold text-text-primary">฿150</div>
                  </label>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-6">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  <label className="flex items-center p-4 border border-text-muted/20 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">
                        Credit / Debit Card
                      </div>
                      <div className="text-sm text-text-muted">Visa, Mastercard, JCB</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-text-muted/20 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="qr"
                      checked={paymentMethod === "qr"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary">QR Payment</div>
                      <div className="text-sm text-text-muted">PromptPay, Thai QR</div>
                    </div>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 p-4 bg-background rounded-lg">
                    <Input label="Card Number" type="text" placeholder="1234 5678 9012 3456" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry Date" type="text" placeholder="MM/YY" />
                      <Input label="CVV" type="text" placeholder="123" />
                    </div>
                    <Input label="Cardholder Name" type="text" placeholder="JOHN DOE" />
                  </div>
                )}

                {paymentMethod === "qr" && (
                  <div className="p-4 bg-background rounded-lg text-center">
                    <div className="w-48 h-48 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <div className="text-text-muted">QR Code will appear here</div>
                    </div>
                    <p className="text-sm text-text-muted">
                      Scan the QR code with your mobile banking app
                    </p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-surface/50 rounded-lg text-sm text-text-muted">
                  <p>
                    <strong className="text-text-primary">Demo Notice:</strong> This is a UI
                    demonstration only. No actual payment will be processed.
                  </p>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-text-primary mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-background rounded flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-text-primary truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold text-text-primary">
                        ฿{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-text-muted/10 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span>฿{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `฿${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount</span>
                      <span>-฿{discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-text-muted/10 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-text-primary">
                    <span>Total</span>
                    <span className="text-primary">฿{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Place Order
                </Button>

                <p className="text-xs text-text-muted text-center mt-4">
                  By placing this order, you agree to our terms and conditions
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Modal isOpen={showSuccess} onClose={handleSuccessClose} title="Order Placed Successfully">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">Thank You!</h3>
          <p className="text-text-muted mb-6">
            Your order has been placed successfully. We'll send you a confirmation email shortly.
          </p>
          <div className="bg-surface p-4 rounded-lg mb-6">
            <p className="text-sm text-text-muted mb-1">Order Number</p>
            <p className="text-lg font-semibold text-primary">
              NV-{new Date().getFullYear()}-{Math.floor(Math.random() * 100000).toString().padStart(6, "0")}
            </p>
          </div>
          <Button onClick={handleSuccessClose}>View Orders</Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
