import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Plus, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Category } from "../backend.d";
import SkeletonCard from "../components/SkeletonCard";
import ThreadRow from "../components/ThreadRow";
import { MOCK_THREADS } from "../data/mockData";
import { useListThreads, useUpvoteThread } from "../hooks/useBackend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: Category.general, label: "General" },
  { value: Category.pergroup, label: "Per Group" },
  { value: Category.event, label: "Event" },
  { value: Category.membertalk, label: "Member Talk" },
] as const;

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export default function DiscussPage() {
  const { data: threads, isLoading } = useListThreads();
  const { identity } = useInternetIdentity();
  const upvoteMutation = useUpvoteThread();
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"hot" | "newest">("hot");

  const rawThreads = threads?.length ? threads : MOCK_THREADS;

  const filtered = rawThreads
    .filter((t) => category === "all" || t.category === category)
    .sort((a, b) =>
      sort === "hot"
        ? b.upvotes - a.upvotes
        : Number(b.createdAt - a.createdAt),
    );

  return (
    <div className="min-h-screen py-8" data-ocid="discuss.page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="section-label mb-2">Forum</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground">
                <span className="text-primary">48</span>DISSCUS
              </h1>
              <p className="text-muted-foreground mt-1">
                Join the conversation with 48 Group fans worldwide
              </p>
            </div>
            {identity && (
              <Button
                data-ocid="discuss.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
              >
                <Plus className="h-4 w-4" /> New Thread
              </Button>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSort("hot")}
              data-ocid="discuss.tab"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                sort === "hot"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-4 w-4" /> Hot
            </button>
            <button
              type="button"
              onClick={() => setSort("newest")}
              data-ocid="discuss.tab"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                sort === "newest"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="h-4 w-4" /> Newest
            </button>
          </div>
        </div>

        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="bg-card border border-border mb-6 h-auto flex-wrap gap-1 p-1">
            {CATEGORIES.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid="discuss.tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map(({ value }) => (
            <TabsContent key={value} value={value}>
              <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
                {isLoading ? (
                  SKELETON_KEYS.map((k) => (
                    <SkeletonCard key={k} variant="thread" />
                  ))
                ) : filtered.length === 0 ? (
                  <div
                    className="text-center py-16"
                    data-ocid="discuss.empty_state"
                  >
                    <div className="text-5xl mb-4">💬</div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2">
                      No threads yet
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Start the conversation!
                    </p>
                  </div>
                ) : (
                  filtered.map((thread, i) => (
                    <ThreadRow
                      key={thread.id}
                      thread={thread}
                      onUpvote={(id) => upvoteMutation.mutate(id)}
                      index={i + 1}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
