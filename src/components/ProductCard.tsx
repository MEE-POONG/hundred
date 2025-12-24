import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-64 bg-background">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.isBestSeller && (
            <div className="absolute top-4 right-4">
              <Badge variant="primary">Best Seller</Badge>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-text-muted mb-4 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-primary">
              ฿{product.price.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-text-muted">
              <svg
                className="w-4 h-4 text-gold mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.rating} ({product.reviewCount})
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </Card>
  );
}
