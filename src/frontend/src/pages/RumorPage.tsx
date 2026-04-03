import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, BadgeCheck, Plus, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import PostCard from "../components/PostCard";
import SkeletonCard from "../components/SkeletonCard";
import { MOCK_POSTS } from "../data/mockData";
import { useLikePost, useListPosts } from "../hooks/useBackend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type FilterType = "all" | "verified" | "community";

interface FilterOption {
  value: FilterType;
  label: string;
  icon?: typeof BadgeCheck;
}

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export default function RumorPage() {
  const { data: posts, isLoading } = useListPosts();
  const { identity } = useInternetIdentity();
  const likeMutation = useLikePost();
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const rawPosts = posts?.length ? posts : MOCK_POSTS;

  const filtered = rawPosts
    .filter((p) => {
      if (filter === "verified") return p.isVerified;
      if (filter === "community") return !p.isVerified;
      return true;
    })
    .filter(
      (p) =>
        search === "" || p.title.toLowerCase().includes(search.toLowerCase()),
    );

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All Posts" },
    { value: "verified", label: "Verified", icon: BadgeCheck },
    { value: "community", label: "Community", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen py-8" data-ocid="rumor.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="section-label mb-2">Community Posts</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground">
                <span className="text-primary">48</span>RUMOR
              </h1>
              <p className="text-muted-foreground mt-1">
                Fan posts, rumors, and community-sourced news
              </p>
            </div>
            {identity && (
              <Button
                data-ocid="rumor.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
              >
                <Plus className="h-4 w-4" /> Post a Rumor
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rumors..."
              data-ocid="rumor.search_input"
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            {filterOptions.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setFilter(value)}
                data-ocid="rumor.tab"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 border text-xs">
              <BadgeCheck className="h-3 w-3 mr-1" /> Admin Verified
            </Badge>
            Official or admin-confirmed posts
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge className="bg-muted text-muted-foreground border-border border text-xs">
              User Post
            </Badge>
            Community-submitted content
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="rumor.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="rumor.empty_state">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              No rumors found
            </h3>
            <p className="text-muted-foreground">Be the first to post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`rumor.item.${i + 1}`}
              >
                <PostCard
                  post={post}
                  onLike={(id) => likeMutation.mutate(id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
