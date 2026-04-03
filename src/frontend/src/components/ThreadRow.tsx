import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronUp, MessageSquare } from "lucide-react";
import type { InternalThread } from "../backend.d";
import { Category } from "../backend.d";
import { formatRelativeTime } from "../data/mockData";

interface ThreadRowProps {
  thread: InternalThread;
  onUpvote?: (id: number) => void;
  index?: number;
}

const CATEGORY_CONFIG = {
  [Category.general]: {
    label: "General",
    className: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  },
  [Category.pergroup]: {
    label: "Per Group",
    className: "bg-purple-600/20 text-purple-400 border-purple-600/30",
  },
  [Category.event]: {
    label: "Event",
    className: "bg-orange-600/20 text-orange-400 border-orange-600/30",
  },
  [Category.membertalk]: {
    label: "Member Talk",
    className: "bg-pink-600/20 text-pink-400 border-pink-600/30",
  },
};

function mockReplyCount(id: number) {
  return (id * 7 + 3) % 50;
}

export default function ThreadRow({ thread, onUpvote, index }: ThreadRowProps) {
  const catConf =
    CATEGORY_CONFIG[thread.category] || CATEGORY_CONFIG[Category.general];
  const authorInitial = thread.authorPrincipal
    ? thread.authorPrincipal.toString().charAt(0).toUpperCase()
    : "?";
  const threadHref = `/discuss/${thread.id}`;

  return (
    <div
      className="group flex items-start gap-4 py-4 px-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
      data-ocid={`thread.item.${index ?? 1}`}
    >
      <button
        type="button"
        onClick={() => onUpvote?.(thread.id)}
        data-ocid="thread.button"
        className="flex flex-col items-center gap-0.5 min-w-[44px] py-1 rounded-lg text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronUp className="h-5 w-5" />
        <span className="text-xs font-bold">{thread.upvotes}</span>
      </button>

      <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
        <AvatarFallback className="bg-secondary text-muted-foreground text-xs font-semibold">
          {authorInitial}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={cn("text-xs font-semibold border", catConf.className)}
          >
            {catConf.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(thread.createdAt)}
          </span>
        </div>

        <a href={threadHref} data-ocid="thread.link">
          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {thread.title}
          </h3>
        </a>

        {thread.content && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {thread.content}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
        <MessageSquare className="h-4 w-4" />
        <span>{mockReplyCount(thread.id)}</span>
      </div>
    </div>
  );
}
