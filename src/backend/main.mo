import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat32 "mo:core/Nat32";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Int32 "mo:core/Int32";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  // Include prefabricated components
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type GroupId = Nat32;
  type MemberId = Nat32;
  type PostId = Nat32;
  type ThreadId = Nat32;
  type Category = { #general; #pergroup; #event; #membertalk };

  // Public data types for serialization
  type Activity = {
    kind : Text;
    id : Text;
    timestamp : Int;
  };

  public type PublicUserProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    avatar : Storage.ExternalBlob;
    bio : Text;
    favoriteGroup : ?GroupId;
    bookmarks : [PostId];
    activities : [Activity];
  };

  public type PublicComment = {
    id : Nat32;
    parentId : Nat32;
    postId : ?PostId;
    content : Text;
    authorPrincipal : Principal;
    createdAt : Int;
  };

  public type PublicPost = {
    id : PostId;
    title : Text;
    content : Text;
    isLive : Bool;
    authorPrincipal : Principal;
    hashtags : [Text];
    thumbnailUrl : Text;
    viewCount : Nat32;
    likeCount : Nat32;
    createdAt : Nat;
    updatedAt : Nat;
    isVerified : Bool;
    isReported : Bool;
  };

  type PublicThread = {
    id : ThreadId;
    title : Text;
    content : Text;
    authorPrincipal : Principal;
    category : Category;
    upvotes : Nat32;
    createdAt : Nat;
  };

  // Internal storage types
  type InternalUserProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    avatar : Storage.ExternalBlob;
    bio : Text;
    favoriteGroup : ?GroupId;
    bookmarks : Set.Set<PostId>;
    activities : List.List<Activity>;
  };

  type InternalComment = {
    id : Nat32;
    parentId : Nat32;
    postId : ?PostId;
    content : Text;
    authorPrincipal : Principal;
    createdAt : Int;
  };

  type InternalPost = {
    id : PostId;
    title : Text;
    content : Text;
    isLive : Bool;
    authorPrincipal : Principal;
    hashtags : [Text];
    thumbnailUrl : Text;
    viewCount : Nat32;
    likeCount : Nat32;
    createdAt : Nat;
    updatedAt : Nat;
    isVerified : Bool;
    isReported : Bool;
  };

  type InternalThread = {
    id : ThreadId;
    title : Text;
    content : Text;
    authorPrincipal : Principal;
    category : Category;
    upvotes : Nat32;
    createdAt : Nat;
  };

  type InternalGroup = {
    id : GroupId;
    name : Text;
    slug : Text;
    description : Text;
    bannerUrl : Text;
    country : Text;
    createdAt : Int;
  };

  type InternalMember = {
    id : MemberId;
    name : Text;
    groupId : GroupId;
    team : Text;
    status : MemberStatus;
    bio : Text;
    photoUrl : Text;
    birthdate : Int;
  };

  type MemberStatus = { #active; #graduated; #hiatus };

  // State Variables
  var nextGroupId : Nat32 = 1;
  var nextMemberId : Nat32 = 1;
  var nextPostId : Nat32 = 1;
  var nextCommentId : Nat32 = 1;
  var nextThreadId : Nat32 = 1;

  let userProfiles = Map.empty<Principal, InternalUserProfile>();
  let posts = Map.empty<PostId, InternalPost>();
  let comments = Map.empty<Nat32, InternalComment>();
  let threads = Map.empty<ThreadId, InternalThread>();
  let groups = Map.empty<GroupId, InternalGroup>();
  let members = Map.empty<MemberId, InternalMember>();

  // Compare module for Post
  module InternalPost {
    public func compare(p1 : InternalPost, p2 : InternalPost) : Order.Order {
      Nat32.compare(p1.id, p2.id);
    };
  };

  // Convert from Internal to Public types
  func toPublicUserProfile(internal : InternalUserProfile) : PublicUserProfile {
    {
      internal with
      bookmarks = internal.bookmarks.toArray();
      activities = internal.activities.toArray();
    };
  };

  // Helper Functions
  func getUserInternal(userPrincipal : Principal) : InternalUserProfile {
    switch (userProfiles.get(userPrincipal)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) { user };
    };
  };

  func getPostInternal(postId : PostId) : InternalPost {
    switch (posts.get(postId)) {
      case (null) {
        Runtime.trap("Post does not exist");
      };
      case (?p) { p };
    };
  };

  func getGroupInternal(groupId : GroupId) : InternalGroup {
    switch (groups.get(groupId)) {
      case (null) {
        Runtime.trap("Group does not exist");
      };
      case (?g) { g };
    };
  };

  func getMemberInternal(memberId : MemberId) : InternalMember {
    switch (members.get(memberId)) {
      case (null) {
        Runtime.trap("Member does not exist");
      };
      case (?m) { m };
    };
  };

  func getThreadInternal(threadId : ThreadId) : InternalThread {
    switch (threads.get(threadId)) {
      case (null) {
        Runtime.trap("Thread does not exist");
      };
      case (?t) { t };
    };
  };

  func getCommentInternal(commentId : Nat32) : InternalComment {
    switch (comments.get(commentId)) {
      case (null) {
        Runtime.trap("Comment does not exist");
      };
      case (?c) { c };
    };
  };

  // User Profile Functions - Required by frontend
  public shared ({ caller }) func getCallerUserProfile() : async PublicUserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    toPublicUserProfile(getUserInternal(caller));
  };

  public shared ({ caller }) func getUserProfile(user : Principal) : async PublicUserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    toPublicUserProfile(getUserInternal(user));
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : PublicUserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let bookmarks = Set.fromArray(profile.bookmarks);
    let activities = List.fromArray<Activity>(profile.activities);
    let updatedProfile : InternalUserProfile = {
      profile with
      principal = caller;
      bookmarks;
      activities;
    };
    userProfiles.add(caller, updatedProfile);
  };

  // List all user profiles - Admin only
  public shared ({ caller }) func listUserProfiles() : async [PublicUserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all profiles");
    };
    userProfiles.values().toArray().map(func(up) { toPublicUserProfile(up) });
  };

  // Add bookmark - User must be authenticated and can only modify their own bookmarks
  public shared ({ caller }) func addBookmark(postId : PostId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add bookmarks");
    };
    ignore getPostInternal(postId);
    let user = getUserInternal(caller);
    user.bookmarks.add(postId);
    userProfiles.add(caller, user);
  };

  // Remove bookmark - User must be authenticated and can only modify their own bookmarks
  public shared ({ caller }) func removeBookmark(postId : PostId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove bookmarks");
    };
    let user = getUserInternal(caller);
    user.bookmarks.remove(postId);
    userProfiles.add(caller, user);
  };

  // Group CRUD - Admin only
  public shared ({ caller }) func createGroup(group : InternalGroup) : async GroupId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create groups");
    };
    let id = nextGroupId;
    let newGroup : InternalGroup = {
      group with
      id;
      createdAt = Time.now();
    };
    groups.add(id, newGroup);
    nextGroupId += 1;
    id;
  };

  // Find group by slug - Public query, no auth needed
  public query func findGroupBySlug(slug : Text) : async InternalGroup {
    let result = groups.values().find(
      func(g) { g.slug == slug }
    );
    switch (result) {
      case (?g) { g };
      case (null) { Runtime.trap("Group does not exist") };
    };
  };

  // Find first group matching a substring with left matching - Public query, no auth needed
  // Use size and compare from core/Text to perform a left match on the string
  public query func findGroupBySubstring(substring : Text) : async InternalGroup {
    let result = groups.values().find(
      func(g) {
        g.slug.size() >= substring.size() and
        Text.compare(
          g.slug,
          substring,
        ) == #less
      }
    );
    switch (result) {
      case (?g) { g };
      case (null) { Runtime.trap("Group does not exist") };
    };
  };

  // List all groups - Public query, no auth needed
  public query ({ caller }) func listGroups() : async [InternalGroup] {
    groups.values().toArray();
  };

  // Member CRUD - Admin only
  public shared ({ caller }) func addMember(member : InternalMember) : async MemberId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add members");
    };
    let id = nextMemberId;
    let newMember : InternalMember = {
      member with
      id;
    };
    members.add(id, newMember);
    nextMemberId += 1;
    id;
  };

  public shared ({ caller }) func deleteMember(memberId : MemberId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete members");
    };
    ignore getMemberInternal(memberId);
    members.remove(memberId);
  };

  // Post CRUD
  // Create post - 48LIVE (isLive=true) requires admin, 48RUMOR (isLive=false) requires user
  public shared ({ caller }) func createPost(post : InternalPost) : async PostId {
    if (post.isLive) {
      // 48LIVE posts - admin only
      if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
        Runtime.trap("Unauthorized: Only admins can create 48LIVE posts");
      };
    } else {
      // 48RUMOR posts - any authenticated user
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only users can create 48RUMOR posts");
      };
    };

    let id = nextPostId;
    let newPost : InternalPost = {
      post with
      id;
      authorPrincipal = caller;
      createdAt = 0;
      updatedAt = 0;
    };
    posts.add(id, newPost);
    nextPostId += 1;
    id;
  };

  // Delete post - Admin or post author
  public shared ({ caller }) func deletePost(postId : PostId) : async () {
    let post = getPostInternal(postId);
    if (caller != post.authorPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the post author or admin can delete this post");
    };
    posts.remove(postId);
  };

  // Like post - Authenticated users only
  public shared ({ caller }) func likePost(postId : PostId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };
    let post = getPostInternal(postId);
    let updatedPost = { post with likeCount = post.likeCount + 1 };
    posts.add(postId, updatedPost);
  };

  // List all posts - Public query, no auth needed
  public query ({ caller }) func listPosts() : async [InternalPost] {
    posts.values().toArray();
  };

  // List live posts - Public query, no auth needed
  public query ({ caller }) func listLivePosts() : async [InternalPost] {
    posts.values().filter(func(p) { p.isLive }).toArray();
  };

  // Find post by hashtag - Public query, no auth needed
  public query ({ caller }) func findPostsByHashtag(hashtag : Text) : async [InternalPost] {
    posts.values().filter(
      func(p) { p.hashtags.findIndex(func(h) { h == hashtag }) != null }
    ).toArray();
  };

  // Comment CRUD
  // Add comment - Authenticated users only
  public shared ({ caller }) func addComment(parentId : Nat32, postId : ?PostId, content : Text) : async Nat32 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };
    let id = nextCommentId;
    let newComment : InternalComment = {
      id;
      parentId;
      postId;
      content;
      authorPrincipal = caller;
      createdAt = Time.now();
    };
    comments.add(id, newComment);
    nextCommentId += 1;
    id;
  };

  // Delete comment - Admin or comment author
  public shared ({ caller }) func deleteComment(commentId : Nat32) : async () {
    let comment = getCommentInternal(commentId);
    if (caller != comment.authorPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the comment author or admin can delete this comment");
    };
    comments.remove(commentId);
  };

  // Thread CRUD
  // Create thread - Authenticated users only
  public shared ({ caller }) func createThread(thread : InternalThread) : async ThreadId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create threads");
    };
    let id = nextThreadId;
    let newThread : InternalThread = {
      thread with
      id;
      authorPrincipal = caller;
      createdAt = 0;
    };
    threads.add(id, newThread);
    nextThreadId += 1;
    id;
  };

  // Upvote thread - Authenticated users only
  public shared ({ caller }) func upvoteThread(threadId : ThreadId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upvote threads");
    };
    let thread = getThreadInternal(threadId);
    let updatedThread = { thread with upvotes = thread.upvotes + 1 };
    threads.add(threadId, updatedThread);
  };

  // Delete thread - Admin or thread author
  public shared ({ caller }) func deleteThread(threadId : ThreadId) : async () {
    let thread = getThreadInternal(threadId);
    if (caller != thread.authorPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the thread author or admin can delete this thread");
    };
    threads.remove(threadId);
  };

  // List threads - Public query, no auth needed
  public query ({ caller }) func listThreads() : async [InternalThread] {
    threads.values().toArray();
  };

  // List threads by category - Public query, no auth needed
  public query ({ caller }) func listThreadsByCategory(category : Category) : async [InternalThread] {
    threads.values().filter(
      func(t) { t.category == category }
    ).toArray();
  };
};
