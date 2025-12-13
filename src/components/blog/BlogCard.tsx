import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type BlogPost } from "@/lib/types";
import { format } from "date-fns";

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full h-48">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={post.imageHint}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">
            {post.content}
          </p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <p>By {post.author} on {format(new Date(post.date), "MMM d, yyyy")}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
