import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, FileText, Globe, Users } from "lucide-react";
import { motion } from "motion/react";
import MemberCard from "../components/MemberCard";
import PostCard from "../components/PostCard";
import SkeletonCard from "../components/SkeletonCard";
import { MOCK_GROUPS, MOCK_MEMBERS, MOCK_POSTS } from "../data/mockData";
import {
  useFindGroupBySlug,
  useLikePost,
  useListGroups,
} from "../hooks/useBackend";

const OFFICIAL_SITES: Record<string, { url: string; label: string }> = {
  akb48: { url: "https://www.akb48.co.jp", label: "www.akb48.co.jp" },
  ske48: { url: "https://www.ske48.co.jp", label: "www.ske48.co.jp" },
  nmb48: { url: "https://www.nmb48.com", label: "www.nmb48.com" },
  hkt48: { url: "https://www.hkt48.jp", label: "www.hkt48.jp" },
  ngt48: { url: "https://www.ngt48.jp", label: "www.ngt48.jp" },
  stu48: { url: "https://www.stu48.com", label: "www.stu48.com" },
  jkt48: { url: "https://www.jkt48.com", label: "www.jkt48.com" },
  bnk48: { url: "https://www.bnk48.com", label: "www.bnk48.com" },
  mnl48: { url: "https://www.mnl48.com", label: "www.mnl48.com" },
  tpe48: { url: "https://tpe48.com", label: "tpe48.com" },
  tsh48: {
    url: "https://www.tokushima48.jp",
    label: "www.tokushima48.jp",
  },
  cgm48: { url: "https://www.cgm48.com", label: "www.cgm48.com" },
  klp48: { url: "https://klp48.com", label: "klp48.com" },
  snh48: { url: "https://www.snh48.com", label: "www.snh48.com" },
  gnz48: { url: "https://gnz48.com", label: "gnz48.com" },
  bej48: { url: "https://www.bej48.com", label: "www.bej48.com" },
  ckg48: { url: "https://www.ckg48.com", label: "www.ckg48.com" },
  cgk48: { url: "https://cgk48.id", label: "cgk48.id" },
};

function GroupDetailPage({ slug }: { slug: string }) {
  const { data: group, isLoading } = useFindGroupBySlug(slug);
  const likeMutation = useLikePost();

  const displayGroup =
    group || MOCK_GROUPS.find((g) => g.slug === slug) || null;
  const relatedPosts = MOCK_POSTS.filter((p) =>
    p.hashtags.some((h) =>
      h.toLowerCase().includes((displayGroup?.name || "").toLowerCase()),
    ),
  );
  const groupMembers = MOCK_MEMBERS.filter(
    (m) => m.groupId === displayGroup?.id,
  );

  const officialSite = slug ? OFFICIAL_SITES[slug.toLowerCase()] : null;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton-pulse h-48 rounded-2xl mb-6" />
        <div className="skeleton-pulse h-8 w-64 rounded mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4"].map((k) => (
            <SkeletonCard key={k} />
          ))}
        </div>
      </div>
    );
  }

  if (!displayGroup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-display font-bold text-2xl mb-2">
            Group Not Found
          </h2>
          <Link to="/groups" className="text-primary hover:underline">
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  const statsData = [
    { icon: Globe, label: "Country", value: displayGroup.country },
    { icon: Users, label: "Members", value: groupMembers.length || "—" },
    { icon: FileText, label: "Articles", value: relatedPosts.length || "—" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          data-ocid="group.link"
        >
          <ArrowLeft className="h-4 w-4" /> All Groups
        </Link>

        <div
          className="relative rounded-2xl overflow-hidden mb-8 h-48 sm:h-64"
          style={{
            background: displayGroup.bannerUrl
              ? `url(${displayGroup.bannerUrl}) center/cover`
              : "linear-gradient(135deg, rgba(225,29,46,0.3) 0%, rgba(30,58,138,0.4) 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-6 left-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
              {displayGroup.country}
            </Badge>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground">
              {displayGroup.name}
            </h1>
          </div>
        </div>

        <p className="text-muted-foreground mb-8 text-base leading-relaxed max-w-2xl">
          {displayGroup.description || "No description available."}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {statsData.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
            >
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-display font-bold text-foreground">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Official Website Section */}
        {officialSite && (
          <div className="mb-12">
            <p className="section-label mb-3">Official</p>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">
              WEBSITE RESMI
            </h2>
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-foreground">
                    {displayGroup.name} Official Site
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {officialSite.label}
                  </div>
                </div>
              </div>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shrink-0"
                data-ocid="group.primary_button"
              >
                <a
                  href={officialSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Kunjungi Website Resmi
                </a>
              </Button>
            </div>

            {/* Website Preview Card */}
            <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
              <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 bg-background/60 rounded-md h-6 flex items-center px-3 max-w-sm mx-auto">
                  <Globe className="h-3 w-3 text-muted-foreground mr-1.5 shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">
                    {officialSite.label}
                  </span>
                </div>
              </div>
              <div className="p-8 text-center">
                <div
                  className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(225,29,46,0.2) 0%, rgba(30,58,138,0.3) 100%)",
                    border: "1px solid rgba(225,29,46,0.2)",
                  }}
                >
                  <span className="font-display font-black text-xl text-primary">
                    {displayGroup.name.replace("48", "")}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">
                  {displayGroup.name} Official Website
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Kunjungi website resmi untuk berita, jadwal, dan informasi
                  terbaru dari {displayGroup.name}.
                </p>
                <a
                  href={officialSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  data-ocid="group.link"
                >
                  Buka Website Resmi
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <p className="section-label mb-3">Related</p>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">
              ARTICLES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.slice(0, 3).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={(id) => likeMutation.mutate(id)}
                />
              ))}
            </div>
          </section>
        )}

        {groupMembers.length > 0 && (
          <section>
            <p className="section-label mb-3">Roster</p>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">
              MEMBERS
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {groupMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  group={displayGroup}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const GROUP_COLOR_CLASSES = [
  "from-red-900/40",
  "from-amber-900/40",
  "from-emerald-900/40",
  "from-blue-900/40",
  "from-purple-900/40",
  "from-cyan-900/40",
  "from-pink-900/40",
  "from-orange-900/40",
];

export default function GroupsPage() {
  const { data: groups, isLoading } = useListGroups();
  const displayGroups = groups?.length ? groups : MOCK_GROUPS;

  return (
    <div className="min-h-screen py-8" data-ocid="groups.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="section-label mb-2">Fan Community</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground">
            <span className="text-primary">48</span>GROUP
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore all 48 sister groups around the world
          </p>
        </motion.div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            data-ocid="groups.loading_state"
          >
            {[
              "g1",
              "g2",
              "g3",
              "g4",
              "g5",
              "g6",
              "g7",
              "g8",
              "g9",
              "g10",
              "g11",
              "g12",
              "g13",
              "g14",
              "g15",
              "g16",
              "g17",
              "g18",
            ].map((k) => (
              <div key={k} className="skeleton-pulse rounded-xl h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayGroups.map((group, i) => (
              <motion.div
                key={group.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                data-ocid={`groups.item.${i + 1}`}
              >
                <a
                  href={`/groups/${group.slug}`}
                  data-ocid="groups.link"
                  className="group block rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 card-hover"
                >
                  <div
                    className={`h-16 bg-gradient-to-br ${GROUP_COLOR_CLASSES[i % GROUP_COLOR_CLASSES.length]} to-card flex items-center justify-center`}
                  >
                    <span className="font-display font-black text-2xl text-foreground group-hover:text-primary transition-colors">
                      {group.name.replace("48", "")}
                    </span>
                  </div>
                  <div className="p-3 text-center">
                    <div className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {group.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {group.country}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { GroupDetailPage };
