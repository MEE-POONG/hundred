import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { blogArticles } from "@/lib/mockData";

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Health Articles</h1>
          <p className="text-xl text-text-muted">
            Evidence-based information about supplements, nutrition, and wellness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogArticles.map((article) => (
            <Card key={article.id} hover>
              <Link href={`/blog/${article.slug}`}>
                <div className="relative h-48 bg-background">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-text-muted text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-text-muted">
                    <span>{article.author}</span>
                    <span>{article.readTime} min read</span>
                  </div>
                  <div className="mt-2 text-sm text-text-muted">
                    {new Date(article.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
