"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type BlogPost } from "@/lib/types";
import { defaultBlogPosts } from "@/lib/data";
import BlogCard from "@/components/blog/BlogCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useLocalStorage<BlogPost[]>(
    "blog-posts",
    defaultBlogPosts
  );
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const openDeleteDialog = (slug: string) => {
    setPostToDelete(slug);
  };

  const handleDelete = () => {
    if (postToDelete) {
      setBlogPosts(blogPosts.filter((p) => p.slug !== postToDelete));
      toast({
        title: "Post Deleted",
        description: "The blog post has been successfully removed.",
      });
      setPostToDelete(null);
    }
  };

  const postToDeleteDetails = blogPosts.find(p => p.slug === postToDelete);

  return (
    <>
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Our Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Articles and insights to help you on your wellness journey.
          </p>
        </div>

        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} onDelete={openDeleteDialog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No blog posts yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
    {postToDelete && (
        <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the blog post titled "{postToDeleteDetails?.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
