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
import { type Testimonial } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { Edit } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  text: z.string().min(10, "Review must be at least 10 characters long"),
});

type FormValues = z.infer<typeof formSchema>;

type NewReviewDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onReviewCreated: (review: Testimonial) => void;
};

export default function NewReviewDialog({ isOpen, setIsOpen, onReviewCreated }: NewReviewDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newReview: Testimonial = {
      ...data,
      id: uuidv4(),
      avatar: `testimonial-${Math.floor(Math.random() * 3) + 1}`,
    };
    onReviewCreated(newReview);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with us. Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="text" className="text-right mt-2">
              Review
            </Label>
            <div className="col-span-3">
              <Textarea id="text" {...register("text")} rows={6} />
               {errors.text && (
                <p className="text-sm text-destructive mt-1">{errors.text.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit Review</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
