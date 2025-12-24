"use client";

import { useState, use } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/lib/mockData";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.slug === resolvedParams.slug);
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("benefits");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Product Not Found</h1>
          <p className="text-text-muted">The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen">
      <Header />

      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-primary text-white px-6 py-3 rounded-lg shadow-lg">
          Added to cart successfully!
        </div>
      )}

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="mb-4 relative h-96 bg-background rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 bg-background rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isBestSeller && <Badge variant="primary">Best Seller</Badge>}
              {product.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-text-primary mb-4">{product.name}</h1>
            <p className="text-xl text-text-muted mb-6">{product.shortDescription}</p>

            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "text-gold" : "text-text-muted/30"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-text-muted">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="text-4xl font-bold text-primary mb-8">
              ฿{product.price.toLocaleString()}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  className="w-10 h-10 bg-surface border border-text-muted/20 rounded-lg hover:border-primary transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="text-xl font-semibold text-text-primary w-12 text-center">
                  {quantity}
                </span>
                <button
                  className="w-10 h-10 bg-surface border border-text-muted/20 rounded-lg hover:border-primary transition-colors"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
              <p className="text-sm text-text-muted mt-2">
                {product.stock} units in stock
              </p>
            </div>

            <Button size="lg" className="w-full mb-4" onClick={handleAddToCart}>
              Add to Cart
            </Button>

            <div className="card p-4 text-sm text-text-muted">
              <p className="font-semibold text-text-primary mb-2">Quality Assurance</p>
              <ul className="space-y-1">
                <li>✓ GMP Certified Facility</li>
                <li>✓ Third-Party Tested</li>
                <li>✓ Free from Heavy Metals</li>
                <li>✓ No Artificial Colors or Flavors</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="border-b border-text-muted/10 mb-6">
            <div className="flex gap-8">
              {[
                { id: "benefits", label: "Benefits" },
                { id: "ingredients", label: "Ingredients" },
                { id: "usage", label: "How to Use" },
                { id: "warnings", label: "Warnings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="prose max-w-none">
            {activeTab === "benefits" && (
              <div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-text-muted">
                      <svg
                        className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5"
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
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  Ingredient List
                </h3>
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-text-muted">
                      • {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "usage" && (
              <div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  Directions for Use
                </h3>
                <p className="text-text-muted">{product.howToUse}</p>
              </div>
            )}

            {activeTab === "warnings" && (
              <div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  Warnings & Cautions
                </h3>
                <ul className="space-y-2">
                  {product.warnings.map((warning, index) => (
                    <li key={index} className="text-text-muted">
                      ⚠ {warning}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-surface border border-text-muted/10 rounded-lg">
                  <p className="text-sm text-text-muted">
                    <strong className="text-text-primary">Disclaimer:</strong> This product is not
                    intended to diagnose, treat, cure, or prevent any disease. Statements have not
                    been evaluated by regulatory authorities. Always consult with a qualified
                    healthcare professional before using any dietary supplement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
