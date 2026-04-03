import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type PostId = number;
export type MemberId = number;
export type GroupId = number;
export interface InternalPost {
    id: PostId;
    title: string;
    likeCount: number;
    content: string;
    thumbnailUrl: string;
    hashtags: Array<string>;
    createdAt: bigint;
    isReported: boolean;
    isLive: boolean;
    updatedAt: bigint;
    viewCount: number;
    isVerified: boolean;
    authorPrincipal: Principal;
}
export type ThreadId = number;
export interface Activity {
    id: string;
    kind: string;
    timestamp: bigint;
}
export interface PublicUserProfile {
    bio: string;
    principal: Principal;
    favoriteGroup?: GroupId;
    name: string;
    activities: Array<Activity>;
    bookmarks: Uint32Array;
    email: string;
    avatar: ExternalBlob;
}
export interface InternalMember {
    id: MemberId;
    bio: string;
    status: MemberStatus;
    birthdate: bigint;
    name: string;
    team: string;
    photoUrl: string;
    groupId: GroupId;
}
export interface InternalGroup {
    id: GroupId;
    country: string;
    name: string;
    createdAt: bigint;
    slug: string;
    description: string;
    bannerUrl: string;
}
export interface InternalThread {
    id: ThreadId;
    upvotes: number;
    title: string;
    content: string;
    createdAt: bigint;
    category: Category;
    authorPrincipal: Principal;
}
export enum Category {
    event = "event",
    pergroup = "pergroup",
    membertalk = "membertalk",
    general = "general"
}
export enum MemberStatus {
    active = "active",
    hiatus = "hiatus",
    graduated = "graduated"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBookmark(postId: PostId): Promise<void>;
    addComment(parentId: number, postId: PostId | null, content: string): Promise<number>;
    addMember(member: InternalMember): Promise<MemberId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createGroup(group: InternalGroup): Promise<GroupId>;
    createPost(post: InternalPost): Promise<PostId>;
    createThread(thread: InternalThread): Promise<ThreadId>;
    deleteComment(commentId: number): Promise<void>;
    deleteMember(memberId: MemberId): Promise<void>;
    deletePost(postId: PostId): Promise<void>;
    deleteThread(threadId: ThreadId): Promise<void>;
    findGroupBySlug(slug: string): Promise<InternalGroup>;
    findGroupBySubstring(substring: string): Promise<InternalGroup>;
    findPostsByHashtag(hashtag: string): Promise<Array<InternalPost>>;
    getCallerUserProfile(): Promise<PublicUserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<PublicUserProfile>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: PostId): Promise<void>;
    listGroups(): Promise<Array<InternalGroup>>;
    listLivePosts(): Promise<Array<InternalPost>>;
    listPosts(): Promise<Array<InternalPost>>;
    listThreads(): Promise<Array<InternalThread>>;
    listThreadsByCategory(category: Category): Promise<Array<InternalThread>>;
    listUserProfiles(): Promise<Array<PublicUserProfile>>;
    removeBookmark(postId: PostId): Promise<void>;
    saveCallerUserProfile(profile: PublicUserProfile): Promise<void>;
    upvoteThread(threadId: ThreadId): Promise<void>;
}
