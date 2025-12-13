"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type BlogPost } from "@/lib/types";
import { defaultBlogPosts } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [blogPosts] = useLocalStorage<BlogPost[]>(
    "blog-posts",
    defaultBlogPosts
  );

  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-muted-foreground">
            By {post.author} on {format(new Date(post.date), "MMMM d, yyyy")}
          </p>
        </div>

        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden my-8">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={post.imageHint}
          />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-foreground/90">
          <p>{post.content}</p>
        </div>
      </div>
    </article>
  );
}
