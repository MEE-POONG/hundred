import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { blogArticles } from "@/lib/mockData";

export default function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const article = blogArticles.find((a) => a.slug === resolvedParams.slug);

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedArticles = blogArticles
    .filter((a) => a.id !== article.id && a.tags.some((tag) => article.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />

      <article className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/blog" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Articles
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="primary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-text-muted mb-8">
            <span>By {article.author}</span>
            <span>•</span>
            <span>
              {new Date(article.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{article.readTime} min read</span>
          </div>

          <div className="relative h-96 bg-background rounded-lg overflow-hidden mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="text-text-muted whitespace-pre-line leading-relaxed">
              {article.content}
            </div>
          </div>

          <div className="mt-12 p-6 bg-surface border border-text-muted/10 rounded-lg">
            <p className="text-sm text-text-muted">
              <strong className="text-text-primary">Medical Disclaimer:</strong> The information
              provided in this article is for educational purposes only and is not intended as
              medical advice. Always consult with a qualified healthcare professional before making
              any changes to your health regimen or starting any new supplement program.
            </p>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="card p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="relative h-32 bg-background rounded mb-3">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-text-muted">{related.readTime} min read</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
