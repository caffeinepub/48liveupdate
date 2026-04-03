import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  Camera,
  Edit2,
  FileText,
  MessageSquare,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { MOCK_POSTS, MOCK_THREADS } from "../data/mockData";
import { useCallerUserProfile, useSaveUserProfile } from "../hooks/useBackend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function ProfilePage() {
  const { identity, login } = useInternetIdentity();
  const { data: profile } = useCallerUserProfile();
  const saveMutation = useSaveUserProfile();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  if (!identity) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="profile.page"
      >
        <div className="text-center max-w-sm">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Sign In Required
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your profile.
          </p>
          <Button
            onClick={login}
            data-ocid="profile.primary_button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  const principal = identity.getPrincipal().toString();
  const displayName = profile?.name || "Anonymous Fan";
  const displayBio =
    profile?.bio || "No bio yet. Edit your profile to add one.";
  const joinedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const handleSave = () => {
    if (!profile) return;
    saveMutation.mutate(
      {
        ...profile,
        name: editName || profile.name,
        bio: editBio || profile.bio,
      },
      { onSuccess: () => setEditing(false) },
    );
  };

  return (
    <div className="min-h-screen py-8" data-ocid="profile.page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-primary">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-display font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground"
                  data-ocid="profile.upload_button"
                  title="Change avatar"
                >
                  <Camera className="h-3 w-3" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={displayName}
                      data-ocid="profile.input"
                      className="bg-background border-border max-w-xs"
                    />
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder={displayBio}
                      data-ocid="profile.textarea"
                      className="bg-background border-border resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        data-ocid="profile.save_button"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                        size="sm"
                      >
                        {saveMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(false)}
                        data-ocid="profile.cancel_button"
                        className="border-border"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="font-display font-bold text-2xl text-foreground">
                        {displayName}
                      </h1>
                      {profile?.favoriteGroup && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                          Fan
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {displayBio}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined {joinedDate}
                    </p>
                  </>
                )}
              </div>

              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(true);
                    setEditName(profile?.name || "");
                    setEditBio(profile?.bio || "");
                  }}
                  data-ocid="profile.edit_button"
                  className="border-border flex-shrink-0 gap-2"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Profile
                </Button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground font-mono break-all">
                Principal:{" "}
                <span className="text-foreground/60">{principal}</span>
              </p>
            </div>
          </div>

          {/* Activity Tabs */}
          <Tabs defaultValue="posts">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger
                value="posts"
                data-ocid="profile.tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <FileText className="h-4 w-4" /> Posts
              </TabsTrigger>
              <TabsTrigger
                value="threads"
                data-ocid="profile.tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <MessageSquare className="h-4 w-4" /> Threads
              </TabsTrigger>
              <TabsTrigger
                value="bookmarks"
                data-ocid="profile.tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Bookmark className="h-4 w-4" /> Bookmarks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="rounded-2xl border border-border bg-card divide-y divide-border">
                {MOCK_POSTS.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.likeCount} likes • {post.viewCount} views
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="threads">
              <div className="rounded-2xl border border-border bg-card divide-y divide-border">
                {MOCK_THREADS.slice(0, 3).map((thread) => (
                  <div
                    key={thread.id}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {thread.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {thread.upvotes} upvotes
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bookmarks">
              <div
                className="rounded-2xl border border-border bg-card p-8 text-center"
                data-ocid="profile.empty_state"
              >
                <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-display font-semibold text-foreground">
                  No bookmarks yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Bookmark articles to read later
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
