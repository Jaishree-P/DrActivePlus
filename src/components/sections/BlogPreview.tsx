"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type BlogPost } from "@/lib/types";
import { defaultBlogPosts } from "@/lib/data";
import BlogCard from "@/components/blog/BlogCard";
import NewPostDialog from "@/components/blog/NewPostDialog";
import { useState } from "react";
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

export default function BlogPreview() {
  const [blogPosts, setBlogPosts] = useLocalStorage<BlogPost[]>(
    "blog-posts",
    defaultBlogPosts
  );
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { toast } = useToast();


  const handlePostCreated = (newPost: BlogPost) => {
    setBlogPosts([newPost, ...blogPosts]);
    setDialogOpen(false);
  };
  
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

  const recentPosts = blogPosts.slice(0, 3);

  return (
    <>
    <section id="blog" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Our Latest Insights
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Stay informed with our latest articles on health, wellness, and physiotherapy.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <NewPostDialog 
              isOpen={isDialogOpen} 
              setIsOpen={setDialogOpen}
              onPostCreated={handlePostCreated}
            />
             <Button variant="secondary" asChild>
                <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <BlogCard key={post.slug} post={post} onDelete={openDeleteDialog} />
          ))}
        </div>
      </div>
    </section>
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
