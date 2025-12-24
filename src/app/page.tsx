import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/mockData";

export default function HomePage() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative bg-gradient-to-br from-background via-surface to-background py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              Professional Daily Supplement Care
            </h1>
            <p className="text-xl text-text-muted mb-8">
              Science-backed formulations designed to support your wellness journey with premium quality ingredients and certified manufacturing standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg">Shop Products</Button>
              </Link>
              <Link href="/certifications">
                <Button variant="outline" size="lg">
                  View Certifications
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Best Sellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            Certified Quality Standards
          </h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">
            Our commitment to excellence is backed by international quality certifications
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">GMP Certified</h3>
              <p className="text-text-muted text-sm">
                Good Manufacturing Practice ensures consistent quality and safety
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">HACCP</h3>
              <p className="text-text-muted text-sm">
                Systematic hazard control for maximum safety assurance
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">FDA Thailand</h3>
              <p className="text-text-muted text-sm">
                Approved and registered by Thai Food and Drug Administration
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Shop by Health Goal
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Immunity", "Skin", "Gut", "Energy"].map((category) => (
              <Link
                key={category}
                href={`/products?goal=${category}`}
                className="card p-6 text-center hover:border-primary/30 transition-colors"
              >
                <div className="text-4xl mb-3">
                  {category === "Immunity" && "🛡️"}
                  {category === "Skin" && "✨"}
                  {category === "Gut" && "🌿"}
                  {category === "Energy" && "⚡"}
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Choose Your Products
              </h3>
              <p className="text-text-muted">
                Browse our curated selection of premium supplements tailored to your health goals
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Review Ingredients
              </h3>
              <p className="text-text-muted">
                Access detailed information about ingredients, benefits, and usage guidelines
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Follow Your Routine
              </h3>
              <p className="text-text-muted">
                Incorporate supplements into your daily wellness routine for consistent results
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Customer Experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Apinya S.",
                comment:
                  "The collagen supplement has been a consistent part of my routine for 3 months. I appreciate the quality and transparency of ingredients.",
                rating: 5,
              },
              {
                name: "Somchai P.",
                comment:
                  "I've been using the probiotic complex for digestive support. The product quality is evident and the customer service is professional.",
                rating: 5,
              },
              {
                name: "Nittaya W.",
                comment:
                  "Impressed by the certification standards and detailed product information. The omega-3 supplement is part of my daily health regimen.",
                rating: 5,
              },
            ].map((review, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-gold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-muted mb-4">{review.comment}</p>
                <p className="text-text-primary font-semibold">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background border-t border-b border-text-muted/10">
        <div className="container-custom text-center">
          <p className="text-sm text-text-muted max-w-4xl mx-auto">
            <strong>Important Notice:</strong> These statements have not been evaluated by the Food and Drug Administration.
            These products are not intended to diagnose, treat, cure, or prevent any disease.
            Individual results may vary. Consult your healthcare provider before starting any supplement regimen,
            especially if you are pregnant, nursing, taking medication, or have a medical condition.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
