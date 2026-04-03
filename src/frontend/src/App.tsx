import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import DiscussPage from "./pages/DiscussPage";
import GroupsPage, { GroupDetailPage } from "./pages/GroupsPage";
import HomePage from "./pages/HomePage";
import LivePage from "./pages/LivePage";
import MembersPage from "./pages/MembersPage";
import ProfilePage from "./pages/ProfilePage";
import RumorPage from "./pages/RumorPage";
import SearchPage from "./pages/SearchPage";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live",
  component: LivePage,
});

const rumorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rumor",
  component: RumorPage,
});

const discussRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discuss",
  component: DiscussPage,
});

const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups",
  component: GroupsPage,
});

const groupDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups/$slug",
  component: () => {
    const { slug } = groupDetailRoute.useParams();
    return <GroupDetailPage slug={slug} />;
  },
});

const membersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/members",
  component: MembersPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
});

// Post detail placeholder
const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$id",
  component: () => {
    const { id } = postDetailRoute.useParams();
    const { MOCK_POSTS } = require("./data/mockData");
    const post = MOCK_POSTS.find((p: any) => String(p.id) === id);
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post ? (
            <>
              <div
                className="aspect-video rounded-2xl overflow-hidden mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #1a0a0f 0%, #0d1b2a 100%)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">♥️</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.hashtags.map((h: string) => (
                  <span key={h} className="text-xs font-semibold text-primary">
                    {h}
                  </span>
                ))}
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-foreground mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                <span>{post.likeCount} likes</span>
                <span>{post.viewCount} views</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {post.content}
              </p>
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-display font-bold text-2xl mb-4">
                Post Not Found
              </h2>
              <a href="/" className="text-primary hover:underline">
                Go Home
              </a>
            </div>
          )}
        </div>
      </div>
    );
  },
});

// Member detail placeholder
const memberDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/members/$id",
  component: () => {
    const { id } = memberDetailRoute.useParams();
    const { MOCK_MEMBERS, MOCK_GROUPS } = require("./data/mockData");
    const member = MOCK_MEMBERS.find((m: any) => String(m.id) === id);
    const group = member
      ? MOCK_GROUPS.find((g: any) => g.id === member.groupId)
      : null;

    const statusColors: Record<string, string> = {
      active: "text-green-400",
      hiatus: "text-yellow-400",
      graduated: "text-muted-foreground",
    };

    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {member ? (
            <>
              <div
                className="w-full aspect-[3/2] rounded-2xl overflow-hidden mb-6 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(160deg, #1a0a1a 0%, #0d1b2a 100%)",
                }}
              >
                <div className="text-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-display font-bold text-primary mx-auto mb-3"
                    style={{
                      background: "rgba(225,29,46,0.1)",
                      border: "2px solid rgba(225,29,46,0.3)",
                    }}
                  >
                    {member.name.charAt(0)}
                  </div>
                </div>
              </div>
              <h1 className="font-display font-black text-3xl text-foreground mb-2">
                {member.name}
              </h1>
              <p className="text-muted-foreground mb-1">
                {group?.name} • {member.team}
              </p>
              <p
                className={`text-sm font-semibold ${statusColors[member.status]} mb-6`}
              >
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </p>
              {member.bio && (
                <p className="text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-display font-bold text-2xl mb-4">
                Member Not Found
              </h2>
              <a href="/members" className="text-primary hover:underline">
                Back to Members
              </a>
            </div>
          )}
        </div>
      </div>
    );
  },
});

// Thread detail placeholder
const threadDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discuss/$id",
  component: () => {
    const { id } = threadDetailRoute.useParams();
    const { MOCK_THREADS, formatRelativeTime } = require("./data/mockData");
    const thread = MOCK_THREADS.find((t: any) => String(t.id) === id);
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {thread ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">
                  {thread.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  • {formatRelativeTime(thread.createdAt)}
                </span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-foreground mb-4">
                {thread.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                <span>{thread.upvotes} upvotes</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {thread.content}
              </p>
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-display font-bold text-2xl mb-4">
                Thread Not Found
              </h2>
              <a href="/discuss" className="text-primary hover:underline">
                Back to Discuss
              </a>
            </div>
          )}
        </div>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  liveRoute,
  rumorRoute,
  discussRoute,
  groupsRoute,
  groupDetailRoute,
  membersRoute,
  profileRoute,
  adminRoute,
  searchRoute,
  postDetailRoute,
  memberDetailRoute,
  threadDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
