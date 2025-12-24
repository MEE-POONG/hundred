"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";

export default function PoliciesPage() {
  const [activeSection, setActiveSection] = useState("privacy");

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Policies & Terms</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: "privacy", label: "Privacy Policy" },
                  { id: "shipping", label: "Shipping Policy" },
                  { id: "returns", label: "Return Policy" },
                  { id: "terms", label: "Terms & Conditions" },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-white"
                        : "text-text-muted hover:bg-surface"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          <div className="lg:col-span-3">
            <Card className="p-8">
              {activeSection === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-text-primary">Privacy Policy</h2>
                  <p className="text-text-muted">Last Updated: December 2024</p>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Information Collection
                    </h3>
                    <p className="text-text-muted mb-4">
                      This is a demonstration website. In a real e-commerce environment, we would
                      collect personal information such as name, email address, shipping address,
                      and payment information to process orders and provide customer service.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Data Usage</h3>
                    <p className="text-text-muted mb-4">
                      Collected information would be used to:
                    </p>
                    <ul className="list-disc list-inside text-text-muted space-y-2">
                      <li>Process and fulfill orders</li>
                      <li>Communicate order status and updates</li>
                      <li>Provide customer support</li>
                      <li>Send marketing communications (with consent)</li>
                      <li>Improve our products and services</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Data Protection
                    </h3>
                    <p className="text-text-muted mb-4">
                      We would implement industry-standard security measures to protect personal
                      information, including encryption, secure servers, and access controls.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Your Rights</h3>
                    <p className="text-text-muted mb-4">You would have the right to:</p>
                    <ul className="list-disc list-inside text-text-muted space-y-2">
                      <li>Access your personal data</li>
                      <li>Request data correction or deletion</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Request data portability</li>
                    </ul>
                  </section>
                </div>
              )}

              {activeSection === "shipping" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-text-primary">Shipping Policy</h2>
                  <p className="text-text-muted">Last Updated: December 2024</p>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Shipping Methods
                    </h3>
                    <div className="space-y-4 text-text-muted">
                      <div>
                        <p className="font-semibold text-text-primary">Standard Shipping</p>
                        <p>Delivery within 3-5 business days</p>
                        <p>Free for orders over ฿1,500</p>
                        <p>฿50 for orders under ฿1,500</p>
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">Express Shipping</p>
                        <p>Delivery within 1-2 business days</p>
                        <p>฿150 flat rate</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Processing Time
                    </h3>
                    <p className="text-text-muted">
                      Orders are typically processed within 1-2 business days. You will receive a
                      confirmation email with tracking information once your order ships.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Shipping Areas
                    </h3>
                    <p className="text-text-muted">
                      We ship nationwide within Thailand. International shipping is not currently
                      available.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Order Tracking
                    </h3>
                    <p className="text-text-muted">
                      Track your order status through your account dashboard or using the tracking
                      link provided in your shipping confirmation email.
                    </p>
                  </section>
                </div>
              )}

              {activeSection === "returns" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-text-primary">Return Policy</h2>
                  <p className="text-text-muted">Last Updated: December 2024</p>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Return Window
                    </h3>
                    <p className="text-text-muted">
                      We accept returns within 30 days of delivery for unopened and unused products
                      in original packaging.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Return Process
                    </h3>
                    <ol className="list-decimal list-inside text-text-muted space-y-2">
                      <li>Contact our customer service team</li>
                      <li>Receive return authorization and instructions</li>
                      <li>Package items securely in original packaging</li>
                      <li>Ship items back using provided return label</li>
                      <li>Receive refund within 7-10 business days of receipt</li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Non-Returnable Items
                    </h3>
                    <ul className="list-disc list-inside text-text-muted space-y-2">
                      <li>Opened or used products (for health and safety reasons)</li>
                      <li>Products without original packaging</li>
                      <li>Products damaged due to misuse</li>
                      <li>Sale or promotional items (unless defective)</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Refunds</h3>
                    <p className="text-text-muted">
                      Refunds will be processed to the original payment method. Shipping fees are
                      non-refundable except in cases of defective products or shipping errors.
                    </p>
                  </section>
                </div>
              )}

              {activeSection === "terms" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-text-primary">Terms & Conditions</h2>
                  <p className="text-text-muted">Last Updated: December 2024</p>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Acceptance of Terms
                    </h3>
                    <p className="text-text-muted">
                      By accessing and using this website, you accept and agree to be bound by these
                      terms and conditions.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Product Information
                    </h3>
                    <p className="text-text-muted mb-4">
                      We strive to provide accurate product information, but:
                    </p>
                    <ul className="list-disc list-inside text-text-muted space-y-2">
                      <li>Product images are for illustration purposes</li>
                      <li>Ingredients and formulations may change</li>
                      <li>Availability and pricing are subject to change</li>
                      <li>We reserve the right to limit quantities</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Health Disclaimers
                    </h3>
                    <p className="text-text-muted mb-4">
                      <strong className="text-text-primary">Important:</strong>
                    </p>
                    <ul className="list-disc list-inside text-text-muted space-y-2">
                      <li>
                        These products are not intended to diagnose, treat, cure, or prevent any
                        disease
                      </li>
                      <li>Statements have not been evaluated by regulatory authorities</li>
                      <li>Consult healthcare professionals before use</li>
                      <li>Individual results may vary</li>
                      <li>Not suitable for pregnant or nursing women without medical advice</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Limitation of Liability
                    </h3>
                    <p className="text-text-muted">
                      We are not liable for any indirect, incidental, or consequential damages
                      arising from product use. Our liability is limited to the purchase price of
                      the product.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      Intellectual Property
                    </h3>
                    <p className="text-text-muted">
                      All content, trademarks, and intellectual property on this website are owned
                      by NOIR VITA or licensed to us. Unauthorized use is prohibited.
                    </p>
                  </section>
                </div>
              )}

              <div className="mt-8 p-6 bg-surface/50 border border-text-muted/10 rounded-lg">
                <p className="text-sm text-text-muted">
                  <strong className="text-text-primary">Demonstration Notice:</strong> This is a UI
                  demonstration website. The policies displayed here are examples for showcase
                  purposes only. Real e-commerce websites should consult legal professionals to
                  draft appropriate policies compliant with applicable laws and regulations.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
