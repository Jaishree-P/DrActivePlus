"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type BlogPost } from "@/lib/types";
import { useState }from "react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  author: z.string().min(2, "Author name is required"),
  imageHint: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type NewPostDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onPostCreated: (post: BlogPost) => void;
};

export default function NewPostDialog({ isOpen, setIsOpen, onPostCreated }: NewPostDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setImageDataUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newPost: BlogPost = {
      ...data,
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
      date: new Date().toISOString(),
      imageUrl: imageDataUrl || `https://picsum.photos/seed/${Math.random()}/600/400`,
      imageHint: data.imageHint || "health wellness",
    };
    onPostCreated(newPost);
    reset();
    setImagePreview(null);
    setImageDataUrl(null);
  };
  
  const handleReset = () => {
    reset();
    setImagePreview(null);
    setImageDataUrl(null);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a New Blog Post</DialogTitle>
          <DialogDescription>
            Share your insights and knowledge with your readers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...register("author")} />
              {errors.author && (
              <p className="text-sm text-destructive mt-1">{errors.author.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" {...register("content")} rows={6} />
              {errors.content && (
              <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Blog Post Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
             {imagePreview && (
              <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden">
                  <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
              </div>
            )}
          </div>
           <div className="space-y-2">
            <Label htmlFor="imageHint">Image Hint (for AI)</Label>
            <Input id="imageHint" {...register("imageHint")} placeholder="e.g., wellness article" />
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleReset}>Cancel</Button>
            <Button type="submit">Create Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
