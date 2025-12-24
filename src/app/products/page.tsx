"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { products } from "@/lib/mockData";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("all");
  const [isVegan, setIsVegan] = useState(false);
  const [isSugarFree, setIsSugarFree] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGoal !== "all") {
      filtered = filtered.filter((p) => p.healthGoal.includes(selectedGoal));
    }

    if (isVegan) {
      filtered = filtered.filter((p) => p.isVegan);
    }

    if (isSugarFree) {
      filtered = filtered.filter((p) => p.isSugarFree);
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => {
        if (max) {
          return p.price >= min && p.price <= max;
        }
        return p.price >= min;
      });
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return b.reviewCount - a.reviewCount;
        });
    }

    return filtered;
  }, [searchQuery, selectedGoal, isVegan, isSugarFree, priceRange, sortBy]);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Shop Products</h1>
        <p className="text-text-muted mb-8">
          Discover our complete range of premium health supplements
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Filters</h2>

              <div className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Health Goal
                  </label>
                  <select
                    className="w-full bg-surface border border-text-muted/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                  >
                    <option value="all">All Goals</option>
                    <option value="Immunity">Immunity</option>
                    <option value="Skin">Skin Health</option>
                    <option value="Gut">Gut Health</option>
                    <option value="Energy">Energy & Vitality</option>
                    <option value="Brain">Brain Health</option>
                    <option value="Heart">Heart Health</option>
                    <option value="Joint Health">Joint Health</option>
                    <option value="Sleep">Sleep & Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Dietary Preferences
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 accent-primary"
                        checked={isVegan}
                        onChange={(e) => setIsVegan(e.target.checked)}
                      />
                      <span className="text-text-primary">Vegan</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 accent-primary"
                        checked={isSugarFree}
                        onChange={(e) => setIsSugarFree(e.target.checked)}
                      />
                      <span className="text-text-primary">Sugar-Free</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Price Range
                  </label>
                  <select
                    className="w-full bg-surface border border-text-muted/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="0-700">Under ฿700</option>
                    <option value="700-1000">฿700 - ฿1,000</option>
                    <option value="1000-1500">฿1,000 - ฿1,500</option>
                    <option value="1500-99999">Above ฿1,500</option>
                  </select>
                </div>

                <button
                  className="w-full btn-outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGoal("all");
                    setIsVegan(false);
                    setIsSugarFree(false);
                    setPriceRange("all");
                    setSortBy("popular");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-text-muted">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </div>
              <Select
                options={[
                  { value: "popular", label: "Most Popular" },
                  { value: "rating", label: "Highest Rated" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "name", label: "Name: A to Z" },
                ]}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="card p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-text-muted mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No products found
                </h3>
                <p className="text-text-muted">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
