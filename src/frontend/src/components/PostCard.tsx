import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import type { InternalPost } from "../backend.d";
import { formatRelativeTime } from "../data/mockData";

interface PostCardProps {
  post: InternalPost;
  onLike?: (id: number) => void;
  onReport?: (id: number) => void;
  showReportButton?: boolean;
  className?: string;
}

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #0d1b2a 0%, #1a0a0f 100%)",
  "linear-gradient(135deg, #0a0f1e 0%, #1a1a2e 100%)",
  "linear-gradient(135deg, #1a0a0a 0%, #0d1b2a 100%)",
  "linear-gradient(135deg, #0f1a0a 0%, #0a0f1e 100%)",
];

export default function PostCard({
  post,
  onLike,
  onReport,
  showReportButton = true,
  className,
}: PostCardProps) {
  const gradient = CARD_GRADIENTS[post.id % CARD_GRADIENTS.length];
  const postHref = `/post/${post.id}`;
  const searchHref = (tag: string) => `/search?q=${encodeURIComponent(tag)}`;

  return (
    <article
      className={cn(
        "group rounded-2xl border border-border bg-card overflow-hidden card-hover transition-all duration-300",
        className,
      )}
      data-ocid="post.card"
    >
      {/* Thumbnail */}
      <a
        href={postHref}
        className="block aspect-video overflow-hidden relative"
      >
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: gradient }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">♥️</div>
              <div className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">
                48 Group
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {post.isLive && (
            <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 border-0">
              LIVE
            </Badge>
          )}
          {post.isVerified && (
            <Badge className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 border-0 flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
      </a>

      <div className="p-4 space-y-3">
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.hashtags.slice(0, 3).map((tag) => (
              <a
                key={tag}
                href={searchHref(tag)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {tag}
              </a>
            ))}
          </div>
        )}

        <a href={postHref}>
          <h3 className="font-display font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>
        </a>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(post.createdAt)}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.viewCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onLike?.(post.id)}
              data-ocid="post.button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group/like"
            >
              <Heart className="h-4 w-4 group-hover/like:fill-primary" />
              <span>{post.likeCount}</span>
            </button>
            <a
              href={postHref}
              data-ocid="post.button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="post.button"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded"
              title="Share"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
            {showReportButton && (
              <button
                type="button"
                onClick={() => onReport?.(post.id)}
                data-ocid="post.button"
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded"
                title="Report"
              >
                <Flag className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
