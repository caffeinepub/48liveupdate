import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  InternalGroup,
  InternalMember,
  InternalPost,
  InternalThread,
  MemberId,
  PostId,
  PublicUserProfile,
  ThreadId,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

// ============================================================
// POST HOOKS
// ============================================================
export function useListPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<InternalPost[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListLivePosts() {
  const { actor, isFetching } = useActor();
  return useQuery<InternalPost[]>({
    queryKey: ["livePosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLivePosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFindPostsByHashtag(hashtag: string) {
  const { actor, isFetching } = useActor();
  return useQuery<InternalPost[]>({
    queryKey: ["postsByHashtag", hashtag],
    queryFn: async () => {
      if (!actor || !hashtag) return [];
      return actor.findPostsByHashtag(hashtag);
    },
    enabled: !!actor && !isFetching && !!hashtag,
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error("Not connected");
      return actor.likePost(postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["livePosts"] });
    },
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: InternalPost) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPost(post);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["livePosts"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["livePosts"] });
    },
  });
}

export function useAddBookmark() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error("Not connected");
      return actor.addBookmark(postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useRemoveBookmark() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeBookmark(postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      parentId,
      postId,
      content,
    }: {
      parentId: number;
      postId: PostId | null;
      content: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addComment(parentId, postId, content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// ============================================================
// GROUP HOOKS
// ============================================================
export function useListGroups() {
  const { actor, isFetching } = useActor();
  return useQuery<InternalGroup[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGroups();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFindGroupBySlug(slug: string) {
  const { actor, isFetching } = useActor();
  return useQuery<InternalGroup | null>({
    queryKey: ["group", slug],
    queryFn: async () => {
      if (!actor || !slug) return null;
      try {
        return await actor.findGroupBySlug(slug);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useCreateGroup() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (group: InternalGroup) => {
      if (!actor) throw new Error("Not connected");
      return actor.createGroup(group);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// ============================================================
// THREAD HOOKS
// ============================================================
export function useListThreads() {
  const { actor, isFetching } = useActor();
  return useQuery<InternalThread[]>({
    queryKey: ["threads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listThreads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListThreadsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<InternalThread[]>({
    queryKey: ["threads", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listThreadsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateThread() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (thread: InternalThread) => {
      if (!actor) throw new Error("Not connected");
      return actor.createThread(thread);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });
}

export function useDeleteThread() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: ThreadId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteThread(threadId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });
}

export function useUpvoteThread() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: ThreadId) => {
      if (!actor) throw new Error("Not connected");
      return actor.upvoteThread(threadId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });
}

// ============================================================
// MEMBER HOOKS
// ============================================================
export function useAddMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (member: InternalMember) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMember(member);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useDeleteMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (memberId: MemberId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMember(memberId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

// ============================================================
// USER PROFILE HOOKS
// ============================================================
export function useCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<PublicUserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<PublicUserProfile | null>({
    queryKey: ["userProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      try {
        return await actor.getUserProfile(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: PublicUserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile as any);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole | null>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserRole();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListUserProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<PublicUserProfile[]>({
    queryKey: ["userProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principal,
      role,
    }: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(principal, role);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfiles"] });
    },
  });
}
