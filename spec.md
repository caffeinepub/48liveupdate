# 48LIVEUPDATE

## Current State
New project. No existing application files. Scaffolded backend actor (empty) and frontend bindings only.

## Requested Changes (Diff)

### Add
- Full-stack fandom community platform for AKB48 and 48 Group idol fanbase
- Backend: Users, Posts (48LIVE news + 48RUMOR community posts), Forum threads/replies, Groups, Members, Comments, Likes, Bookmarks, Reports, Hashtags
- Sticky top navbar: 48HOME, 48LIVE, 48RUMOR, 48DISSCUS, 48GROUP (dynamic dropdown), MEMBER, Search, Profile/Login
- 48HOME landing page: hero banner, latest news section, trending rumors, hot discussions, trending hashtags, quick access groups
- 48LIVE page: admin-only news articles, thumbnail, tags, comments, share, sorting (newest/popular)
- 48RUMOR page: community posts (admin + users), Admin Verified / User Post labels, like/comment/report
- 48DISSCUS forum: threads, replies, upvotes, categories (General, Per Group, Event, Member Talk)
- 48GROUP dynamic system: default groups (AKB48, SKE48, NMB48, HKT48, NGT48, STU48, JKT48, BNK48, MNL48, TPE48, TSH48, CGM48, KLP48, SNH48, GNZ48, BEJ48, CKG48, CGK48), group pages with banner/description/related articles/member list/events
- MEMBER page: list view (photo, name, group, team, status), filters (group/team/status), detail page (biodata, schedule, related articles, popularity stats)
- User system: Register/Login, roles (Admin/User), profile editing (avatar, bio, favorite group), activity tracking (posts, comments, threads, bookmarks)
- Admin panel: manage 48LIVE articles, 48RUMOR posts, users, forum moderation, groups, member database
- Admin account: default username 48LIVEUPDATE, force password change on first login, passwords hashed in backend
- Smart systems: global hashtag system, auto-link articles to group pages by tag, global search (articles/members/forum), trending algorithm (likes + views)
- Extra features: notifications, dark/light theme toggle, bookmarks, report system, verified badge

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- User management: register, login (username/password with hashing), role management (admin/user), profile editing, force password change flag
- Post management: create/read/update/delete articles (type: live/rumor), with hashtags, thumbnails, view count, like count
- Comment system: add/delete comments on posts and forum threads
- Forum system: threads, replies, upvotes, categories
- Group management: CRUD for groups with default data seeded, admin-only mutations
- Member database: CRUD for members (name, group, team, status, bio, photo)
- Like/bookmark system: users can like posts and bookmark articles
- Report system: flag posts/comments for moderation
- Hashtag indexing: auto-link content by hashtag tags
- Trending score: calculated from likes + views
- Search: query across posts, members, forum threads
- Notifications: in-app notifications for user activities

### Frontend (React/TypeScript/Tailwind)
- Dark theme as default with light theme toggle
- Navbar component (sticky, with dynamic 48GROUP dropdown)
- 48HOME landing page with hero, sections for latest/trending content
- 48LIVE news portal page
- 48RUMOR community posts page
- 48DISSCUS forum page with thread/reply UI
- 48GROUP dynamic pages
- MEMBER list + detail pages
- Auth pages: login, register
- Profile page with activity tabs
- Admin panel dashboard with all management features
- Global search modal
- Loading skeletons, hover glow effects, smooth transitions
