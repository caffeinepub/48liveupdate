import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import PostCard from "../components/PostCard";
import SkeletonCard from "../components/SkeletonCard";
import { MOCK_POSTS } from "../data/mockData";
import {
  useIsCallerAdmin,
  useLikePost,
  useListLivePosts,
} from "../hooks/useBackend";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export default function LivePage() {
  const { data: posts, isLoading } = useListLivePosts();
  const { data: isAdmin } = useIsCallerAdmin();
  const likeMutation = useLikePost();
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [search, setSearch] = useState("");

  const rawPosts = posts?.length ? posts : MOCK_POSTS.filter((p) => p.isLive);

  const filtered = rawPosts
    .filter(
      (p) =>
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.hashtags.some((h) => h.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) =>
      sort === "newest"
        ? Number(b.createdAt - a.createdAt)
        : b.likeCount - a.likeCount,
    );

  return (
    <div className="min-h-screen py-8" data-ocid="live.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="section-label mb-2">Admin News</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground">
                <span className="text-primary">48</span>LIVE
              </h1>
              <p className="text-muted-foreground mt-1">
                Official news and updates from the 48 Group world
              </p>
            </div>
            {isAdmin && (
              <Button
                data-ocid="live.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
              >
                <Plus className="h-4 w-4" /> New Article
              </Button>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              data-ocid="live.search_input"
              className="pl-9 bg-card border-border"
            />
          </div>
          <Select
            value={sort}
            onValueChange={(v: "newest" | "popular") => setSort(v)}
          >
            <SelectTrigger
              className="w-40 bg-card border-border"
              data-ocid="live.select"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="live.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="live.empty_state">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`live.item.${i + 1}`}
              >
                <PostCard
                  post={post}
                  onLike={(id) => likeMutation.mutate(id)}
                  showReportButton={false}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
