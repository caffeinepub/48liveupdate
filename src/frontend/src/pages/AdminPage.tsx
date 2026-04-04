import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "@tanstack/react-router";
import {
  Activity,
  Globe,
  Loader2,
  MessageSquare,
  Newspaper,
  Plus,
  Shield,
  Trash2,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import SkeletonCard from "../components/SkeletonCard";
import { MOCK_GROUPS, MOCK_POSTS, MOCK_THREADS } from "../data/mockData";
import { formatRelativeTime } from "../data/mockData";
import {
  useDeletePost,
  useDeleteThread,
  useIsCallerAdmin,
  useListGroups,
  useListPosts,
  useListThreads,
  useListUserProfiles,
} from "../hooks/useBackend";

type DeleteTarget =
  | { type: "post"; id: number }
  | { type: "thread"; id: number }
  | null;

export default function AdminPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: posts } = useListPosts();
  const { data: threads } = useListThreads();
  const { data: groups } = useListGroups();
  const { data: users } = useListUserProfiles();
  const deletePostMutation = useDeletePost();
  const deleteThreadMutation = useDeleteThread();

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  // Stats only use fallback mock for display numbers
  const displayPosts = posts?.length ? posts : MOCK_POSTS;
  const displayThreads = threads?.length ? threads : MOCK_THREADS;
  const displayGroups = groups?.length ? groups : MOCK_GROUPS;

  // Real data only (no mock fallback) for deletable tables
  const realPosts = posts ?? [];
  const realThreads = threads ?? [];

  const isPendingDelete =
    deletePostMutation.isPending || deleteThreadMutation.isPending;

  function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === "post") {
      deletePostMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Konten berhasil dihapus");
          setDeleteTarget(null);
        },
        onError: () => {
          toast.error("Gagal menghapus konten");
          setDeleteTarget(null);
        },
      });
    } else {
      deleteThreadMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Konten berhasil dihapus");
          setDeleteTarget(null);
        },
        onError: () => {
          toast.error("Gagal menghapus konten");
          setDeleteTarget(null);
        },
      });
    }
  }

  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <div className="skeleton-pulse h-16 w-16 rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.error_state"
      >
        <div className="text-center max-w-sm">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You need admin privileges to access this panel.
          </p>
          <Button asChild variant="outline" className="border-border">
            <a href="/">Go Home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-ocid="admin.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-yellow-400" />
            <p className="section-label text-yellow-400">Admin Panel</p>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground">
            DASHBOARD
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage content, users, and settings
          </p>
        </motion.div>

        {/* Stats — uses displayPosts/displayThreads (mock fallback ok here) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Newspaper,
              label: "Total Posts",
              value: displayPosts.length,
              color: "text-primary",
            },
            {
              icon: MessageSquare,
              label: "Threads",
              value: displayThreads.length,
              color: "text-blue-400",
            },
            {
              icon: Globe,
              label: "Groups",
              value: displayGroups.length,
              color: "text-green-400",
            },
            {
              icon: Users,
              label: "Users",
              value: users?.length || 0,
              color: "text-purple-400",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <div className="font-display font-black text-3xl text-foreground">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="articles">
          <TabsList className="bg-card border border-border mb-6 h-auto flex-wrap">
            <TabsTrigger
              value="articles"
              data-ocid="admin.tab"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Newspaper className="h-4 w-4" /> 48LIVE
            </TabsTrigger>
            <TabsTrigger
              value="rumors"
              data-ocid="admin.tab"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <TrendingUp className="h-4 w-4" /> 48RUMOR
            </TabsTrigger>
            <TabsTrigger
              value="forum"
              data-ocid="admin.tab"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <MessageSquare className="h-4 w-4" /> Forum
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              data-ocid="admin.tab"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Globe className="h-4 w-4" /> Groups
            </TabsTrigger>
            <TabsTrigger
              value="users"
              data-ocid="admin.tab"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <UserCog className="h-4 w-4" /> Users
            </TabsTrigger>
          </TabsList>

          {/* 48LIVE Articles — real backend posts only */}
          <TabsContent value="articles">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">
                Manage 48LIVE Articles
              </h2>
              <Button
                data-ocid="admin.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Plus className="h-4 w-4" /> New Article
              </Button>
            </div>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Title
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Hashtags
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Likes
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Views
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {realPosts.filter((p) => p.isLive).length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12"
                        data-ocid="admin.empty_state"
                      >
                        <div className="text-3xl mb-2">📰</div>
                        <p className="text-muted-foreground text-sm">
                          Belum ada artikel 48LIVE. Buat artikel pertama!
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    realPosts
                      .filter((p) => p.isLive)
                      .map((post, i) => (
                        <TableRow
                          key={post.id}
                          className="border-border"
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell className="font-medium text-foreground max-w-xs">
                            <span className="line-clamp-1">{post.title}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {post.hashtags.slice(0, 2).map((h) => (
                                <Badge
                                  key={h}
                                  className="text-xs bg-primary/10 text-primary border-primary/20"
                                >
                                  {h}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {post.likeCount}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {post.viewCount}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {formatRelativeTime(post.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteTarget({ type: "post", id: post.id })
                              }
                              disabled={isPendingDelete}
                              data-ocid="admin.delete_button"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                            >
                              {isPendingDelete &&
                              deleteTarget?.id === post.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 48RUMOR — real backend posts only */}
          <TabsContent value="rumors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">
                Moderate 48RUMOR
              </h2>
            </div>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Title
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Reported
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Likes
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {realPosts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12"
                        data-ocid="admin.empty_state"
                      >
                        <div className="text-3xl mb-2">📣</div>
                        <p className="text-muted-foreground text-sm">
                          Belum ada konten rumor untuk dimoderasi.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    realPosts.map((post, i) => (
                      <TableRow
                        key={post.id}
                        className="border-border"
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="font-medium text-foreground max-w-xs">
                          <span className="line-clamp-1">{post.title}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              post.isVerified
                                ? "bg-blue-600/20 text-blue-400 border-blue-600/30 border"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {post.isVerified ? "Verified" : "User Post"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {post.isReported && (
                            <Badge className="bg-destructive/20 text-destructive border-destructive/30 border">
                              Reported
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {post.likeCount}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteTarget({ type: "post", id: post.id })
                            }
                            disabled={isPendingDelete}
                            data-ocid="admin.delete_button"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          >
                            {isPendingDelete && deleteTarget?.id === post.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Forum — real backend threads only */}
          <TabsContent value="forum">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">
                Moderate Forum
              </h2>
            </div>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Thread
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Upvotes
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {realThreads.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12"
                        data-ocid="admin.empty_state"
                      >
                        <div className="text-3xl mb-2">💬</div>
                        <p className="text-muted-foreground text-sm">
                          Belum ada thread forum untuk dimoderasi.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    realThreads.map((thread, i) => (
                      <TableRow
                        key={thread.id}
                        className="border-border"
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="font-medium text-foreground max-w-xs">
                          <span className="line-clamp-1">{thread.title}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="text-xs bg-muted text-muted-foreground">
                            {thread.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {thread.upvotes}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formatRelativeTime(thread.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteTarget({ type: "thread", id: thread.id })
                            }
                            disabled={isPendingDelete}
                            data-ocid="admin.delete_button"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          >
                            {isPendingDelete &&
                            deleteTarget?.id === thread.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Groups */}
          <TabsContent value="groups">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">
                Manage Groups
              </h2>
              <Button
                data-ocid="admin.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Plus className="h-4 w-4" /> Add Group
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {displayGroups.map((group, i) => (
                <div
                  key={group.slug}
                  className="rounded-xl border border-border bg-card p-3 text-center"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <div className="font-display font-bold text-sm text-foreground mb-1">
                    {group.name}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {group.country}
                  </div>
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      data-ocid="admin.edit_button"
                    >
                      <Activity className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      data-ocid="admin.delete_button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">
                Manage Users
              </h2>
            </div>
            {!users || users.length === 0 ? (
              <div
                className="rounded-xl border border-border bg-card p-8 text-center"
                data-ocid="admin.empty_state"
              >
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No registered users yet</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">
                        User
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Email
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Role
                      </TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, i) => (
                      <TableRow
                        key={user.principal.toString()}
                        className="border-border"
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="font-medium text-foreground">
                          {user.name || "Anonymous"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {user.email || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge className="text-xs bg-muted text-muted-foreground">
                            user
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-ocid="admin.edit_button"
                            className="text-muted-foreground hover:text-foreground gap-1 text-xs"
                          >
                            <UserCog className="h-3.5 w-3.5" /> Role
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isPendingDelete) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="admin.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Hapus konten ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Konten akan dihapus secara
              permanen dari platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPendingDelete}
              onClick={() => setDeleteTarget(null)}
              data-ocid="admin.cancel_button"
              className="border-border"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPendingDelete}
              data-ocid="admin.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPendingDelete ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
