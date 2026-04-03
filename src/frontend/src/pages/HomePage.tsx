import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, TrendingUp, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import PostCard from "../components/PostCard";
import SkeletonCard from "../components/SkeletonCard";
import ThreadRow from "../components/ThreadRow";
import {
  MOCK_GROUPS,
  MOCK_POSTS,
  MOCK_THREADS,
  TRENDING_HASHTAGS,
} from "../data/mockData";
import {
  useLikePost,
  useListLivePosts,
  useListPosts,
  useListThreads,
  useUpvoteThread,
} from "../hooks/useBackend";

const GROUP_COLORS: Record<string, string> = {
  akb48: "#E11D2E",
  ske48: "#f59e0b",
  nmb48: "#10b981",
  hkt48: "#3b82f6",
  ngt48: "#8b5cf6",
  stu48: "#06b6d4",
  jkt48: "#ef4444",
  bnk48: "#f97316",
  mnl48: "#84cc16",
  tpe48: "#06b6d4",
  tsh48: "#a855f7",
  cgm48: "#ec4899",
  klp48: "#14b8a6",
  snh48: "#f43f5e",
  gnz48: "#8b5cf6",
  bej48: "#0ea5e9",
  ckg48: "#d97706",
  cgk48: "#16a34a",
};

const STAGE_BEAMS = [
  { pos: 20, rotate: -5 },
  { pos: 40, rotate: 8 },
  { pos: 60, rotate: -11 },
  { pos: 80, rotate: 14 },
];

const STATS = [
  { icon: Zap, label: "Live Updates", value: "24/7" },
  { icon: TrendingUp, label: "Active Posts", value: "2.4K+" },
  { icon: Users, label: "Community Members", value: "48K+" },
];

export default function HomePage() {
  const { data: livePosts, isLoading: loadingLive } = useListLivePosts();
  const { data: allPosts, isLoading: loadingPosts } = useListPosts();
  const { data: threads, isLoading: loadingThreads } = useListThreads();
  const likeMutation = useLikePost();
  const upvoteMutation = useUpvoteThread();

  const displayLivePosts = livePosts?.length
    ? livePosts
    : MOCK_POSTS.filter((p) => p.isLive);
  const displayRumorPosts = allPosts?.length
    ? allPosts.filter((p) => !p.isLive)
    : MOCK_POSTS.filter((p) => !p.isLive);
  const displayThreads = threads?.length ? threads : MOCK_THREADS;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        data-ocid="home.section"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(225,29,46,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 30% 70%, rgba(30,58,138,0.3) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 70% 70%, rgba(30,58,138,0.25) 0%, transparent 50%), linear-gradient(to bottom, oklch(0.10 0.015 255) 0%, oklch(0.08 0.015 270) 100%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          {STAGE_BEAMS.map(({ pos, rotate }) => (
            <div
              key={pos}
              className="absolute bottom-0 opacity-10"
              style={{
                left: `${pos}%`,
                width: "2px",
                height: "80%",
                background:
                  "linear-gradient(to top, rgba(225,29,46,0.8), transparent)",
                transform: `rotate(${rotate}deg)`,
                transformOrigin: "bottom center",
              }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(225,29,46,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,46,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-bold tracking-widest uppercase mb-6 px-4 py-1.5">
              ⚡ The #1 48 Group Community Platform
            </Badge>
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-foreground leading-[0.9] mb-6">
              <span className="text-primary">48</span>LIVE
              <br />
              <span className="text-gradient-red">UPDATE</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Your premier destination for 48 Group news, fan discussions,
              member database, and community. Stay connected with the world of
              AKB48, JKT48, BNK48 and all sister groups.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                data-ocid="home.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 rounded-full glow-red hover:glow-red-strong transition-all duration-300"
              >
                <Link to="/live">
                  Explore 48LIVE <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                data-ocid="home.secondary_button"
                className="border-border text-foreground hover:bg-muted font-bold text-base px-8 rounded-full"
              >
                <Link to="/discuss">Join Discussion</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-0.5 h-12 bg-gradient-to-b from-primary to-transparent rounded" />
        </div>
      </section>

      {/* STATS BAR */}
      <section
        className="border-y border-border"
        style={{ background: "oklch(0.12 0.02 255)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-border">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="py-4 px-6 flex items-center gap-3 justify-center"
              >
                <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <div className="font-display font-bold text-lg text-foreground">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* LATEST FROM 48LIVE */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          data-ocid="home.section"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label mb-1">Latest News</p>
              <h2 className="font-display font-bold text-2xl text-foreground">
                LIVE UPDATES & NEWS
              </h2>
            </div>
            <Link
              to="/live"
              data-ocid="home.link"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {loadingLive ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {["s1", "s2", "s3", "s4"].map((k) => (
                <SkeletonCard key={k} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayLivePosts.slice(0, 4).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={(id) => likeMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TRENDING 48RUMOR */}
          <motion.section
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            data-ocid="home.section"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="section-label mb-1">Community</p>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  TRENDING 48RUMOR
                </h2>
              </div>
              <Link
                to="/rumor"
                data-ocid="home.link"
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              {loadingPosts
                ? ["t1", "t2", "t3"].map((k) => (
                    <SkeletonCard
                      key={k}
                      variant="thread"
                      className="border-b border-border last:border-0"
                    />
                  ))
                : displayRumorPosts.slice(0, 4).map((post, i) => (
                    <div
                      key={post.id}
                      className="p-4 hover:bg-muted/50 transition-colors"
                      data-ocid={`rumor.item.${i + 1}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            {post.hashtags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs font-semibold text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <a href={`/post/${post.id}`} data-ocid="rumor.link">
                            <h3 className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                          </a>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.likeCount} likes •{" "}
                            {post.viewCount.toLocaleString()} views
                          </p>
                        </div>
                        <span className="text-2xl font-display font-black text-muted/30">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </motion.section>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              data-ocid="home.section"
            >
              <p className="section-label mb-3">Trending</p>
              <h2 className="font-display font-bold text-xl text-foreground mb-4">
                HASHTAGS
              </h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING_HASHTAGS.map((tag) => (
                  <a
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    data-ocid="home.link"
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-border hover:border-primary"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              data-ocid="home.section"
            >
              <p className="section-label mb-3">Quick Access</p>
              <h2 className="font-display font-bold text-xl text-foreground mb-4">
                48 GROUPS
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {MOCK_GROUPS.slice(0, 9).map((group) => {
                  const color = GROUP_COLORS[group.slug] || "#E11D2E";
                  return (
                    <a
                      key={group.slug}
                      href={`/groups/${group.slug}`}
                      data-ocid="home.link"
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-200 group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: color }}
                      >
                        {group.name.replace("48", "").slice(0, 3)}
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                        {group.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </motion.section>
          </div>
        </div>

        {/* HOT DISCUSSIONS */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          data-ocid="home.section"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label mb-1">Forum</p>
              <h2 className="font-display font-bold text-2xl text-foreground">
                HOT DISCUSSIONS
              </h2>
            </div>
            <Link
              to="/discuss"
              data-ocid="home.link"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            {loadingThreads
              ? ["t1", "t2", "t3"].map((k) => (
                  <SkeletonCard key={k} variant="thread" />
                ))
              : displayThreads
                  .slice(0, 5)
                  .map((thread, i) => (
                    <ThreadRow
                      key={thread.id}
                      thread={thread}
                      onUpvote={(id) => upvoteMutation.mutate(id)}
                      index={i + 1}
                    />
                  ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
