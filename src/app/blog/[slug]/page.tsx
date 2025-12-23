"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type BlogPost } from "@/lib/types";
import { defaultBlogPosts } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

  const [post, setPost] = useState<BlogPost | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for blogPosts to be loaded from localStorage.
    if (blogPosts.length === 0 && localStorage.getItem('blog-posts') === null) {
      // Still loading from storage, or it's genuinely empty on first load.
      // Let's not jump to notFound() immediately.
      return;
    }

    const foundPost = blogPosts.find((p) => p.slug === params.slug);

    if (foundPost) {
        setPost(foundPost);
    } else {
        // Only declare notFound if we are sure posts are loaded and the item isn't there.
        if (localStorage.getItem('blog-posts') !== null) {
            notFound();
        }
    }
    setIsLoading(false);
  }, [params.slug, blogPosts]);


  if (isLoading) {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
             <div className="text-center mb-8">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto mt-4" />
             </div>
             <Skeleton className="relative w-full h-64 md:h-96 rounded-lg my-8" />
             <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
             </div>
        </div>
    )
  }
  
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
