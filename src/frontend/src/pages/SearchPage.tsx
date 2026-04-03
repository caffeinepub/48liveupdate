import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Newspaper, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { MemberStatus } from "../backend.d";
import PostCard from "../components/PostCard";
import ThreadRow from "../components/ThreadRow";
import { MOCK_MEMBERS, MOCK_POSTS, MOCK_THREADS } from "../data/mockData";

const STATUS_CONFIG = {
  [MemberStatus.active]: "bg-green-600/20 text-green-400 border-green-600/30",
  [MemberStatus.hiatus]:
    "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  [MemberStatus.graduated]: "bg-muted text-muted-foreground",
};

export default function SearchPage() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState("articles");

  const q = query.toLowerCase();

  const articleResults = MOCK_POSTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.hashtags.some((h) => h.toLowerCase().includes(q)),
  );

  const threadResults = MOCK_THREADS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q),
  );

  const memberResults = MOCK_MEMBERS.filter(
    (m) => m.name.toLowerCase().includes(q) || m.team.toLowerCase().includes(q),
  );

  const totalResults =
    articleResults.length + threadResults.length + memberResults.length;

  return (
    <div className="min-h-screen py-8" data-ocid="search.page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="section-label mb-2">Global Search</p>
          <h1 className="font-display font-black text-4xl text-foreground mb-4">
            SEARCH
          </h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, members, discussions..."
              data-ocid="search.search_input"
              className="pl-12 py-3 bg-card border-border text-base"
            />
          </div>

          {query && (
            <p className="text-sm text-muted-foreground mt-2">
              Found{" "}
              <span className="text-foreground font-semibold">
                {totalResults}
              </span>{" "}
              results for "{query}"
            </p>
          )}
        </motion.div>

        {!query ? (
          <div className="text-center py-20" data-ocid="search.empty_state">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              Start Searching
            </h3>
            <p className="text-muted-foreground">
              Search for articles, members, or discussions
            </p>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger
                value="articles"
                data-ocid="search.tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Newspaper className="h-4 w-4" /> Articles (
                {articleResults.length})
              </TabsTrigger>
              <TabsTrigger
                value="threads"
                data-ocid="search.tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <MessageCircle className="h-4 w-4" /> Discussions (
                {threadResults.length})
              </TabsTrigger>
              <TabsTrigger
                value="members"
                data-ocid="search.tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Users className="h-4 w-4" /> Members ({memberResults.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles">
              {articleResults.length === 0 ? (
                <div
                  className="text-center py-12"
                  data-ocid="search.empty_state"
                >
                  <p className="text-muted-foreground">No articles found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articleResults.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="threads">
              {threadResults.length === 0 ? (
                <div
                  className="text-center py-12"
                  data-ocid="search.empty_state"
                >
                  <p className="text-muted-foreground">No discussions found</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card divide-y divide-border">
                  {threadResults.map((thread, i) => (
                    <ThreadRow key={thread.id} thread={thread} index={i + 1} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="members">
              {memberResults.length === 0 ? (
                <div
                  className="text-center py-12"
                  data-ocid="search.empty_state"
                >
                  <p className="text-muted-foreground">No members found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberResults.map((member) => (
                    <a
                      key={member.id}
                      href={`/members/${member.id}`}
                      data-ocid="search.link"
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-display font-bold text-primary flex-shrink-0"
                        style={{
                          background: "rgba(225,29,46,0.1)",
                          border: "2px solid rgba(225,29,46,0.2)",
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {member.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.team}
                        </div>
                      </div>
                      <Badge
                        className={`text-xs border ${STATUS_CONFIG[member.status]}`}
                      >
                        {member.status.charAt(0).toUpperCase() +
                          member.status.slice(1)}
                      </Badge>
                    </a>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
