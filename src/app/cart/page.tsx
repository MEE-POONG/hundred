"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const shipping = cart.length > 0 ? (getCartTotal() >= 1500 ? 0 : 50) : 0;
  const discount = 0;
  const total = getCartTotal() + shipping - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom py-20">
          <Card className="p-12 text-center max-w-2xl mx-auto">
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-text-primary mb-4">Your cart is empty</h2>
            <p className="text-text-muted mb-8">
              Discover our premium health supplements and start your wellness journey
            </p>
            <Link href="/products">
              <Button>Shop Products</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row gap-4 py-6 border-b border-text-muted/10 last:border-0"
                >
                  <div className="relative w-full sm:w-32 h-32 bg-background rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="text-lg font-semibold text-text-primary hover:text-primary transition-colors mb-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-text-muted mb-4">
                      {item.product.shortDescription}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 bg-surface border border-text-muted/20 rounded hover:border-primary transition-colors"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 bg-surface border border-text-muted/20 rounded hover:border-primary transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.min(item.product.stock, item.quantity + 1)
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-sm text-red-500 hover:text-red-400 transition-colors"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right sm:text-left">
                    <div className="text-xl font-bold text-primary">
                      ฿{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-sm text-text-muted">
                      ฿{item.product.price.toLocaleString()} each
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
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
                {shipping === 0 && getCartTotal() >= 1500 && (
                  <div className="text-sm text-primary">
                    ✓ You've qualified for free shipping!
                  </div>
                )}
                {shipping > 0 && (
                  <div className="text-sm text-text-muted">
                    Add ฿{(1500 - getCartTotal()).toLocaleString()} more for free shipping
                  </div>
                )}
              </div>

              <div className="border-t border-text-muted/10 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-text-primary">
                  <span>Total</span>
                  <span className="text-primary">฿{total.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="ghost" className="w-full mt-4">
                  Continue Shopping
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-text-muted/10">
                <div className="text-sm text-text-muted space-y-2">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Secure checkout
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Multiple payment options
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    Free returns within 30 days
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
