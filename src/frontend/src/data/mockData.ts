// Mock/seed data for initial display and fallback
import type {
  InternalGroup,
  InternalMember,
  InternalPost,
  InternalThread,
} from "../backend.d";
import { Category, MemberStatus } from "../backend.d";

export const MOCK_GROUPS: InternalGroup[] = [
  {
    id: 1,
    name: "AKB48",
    slug: "akb48",
    country: "Japan",
    description: "The original 48 Group based in Akihabara, Tokyo.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 2,
    name: "SKE48",
    slug: "ske48",
    country: "Japan",
    description: "Sister group based in Sakae, Nagoya.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 3,
    name: "NMB48",
    slug: "nmb48",
    country: "Japan",
    description: "Sister group based in Namba, Osaka.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 4,
    name: "HKT48",
    slug: "hkt48",
    country: "Japan",
    description: "Sister group based in Hakata, Fukuoka.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 5,
    name: "NGT48",
    slug: "ngt48",
    country: "Japan",
    description: "Sister group based in Niigata.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 6,
    name: "STU48",
    slug: "stu48",
    country: "Japan",
    description: "Sister group sailing the Seto Inland Sea.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 7,
    name: "JKT48",
    slug: "jkt48",
    country: "Indonesia",
    description: "First international 48 Group based in Jakarta.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 8,
    name: "BNK48",
    slug: "bnk48",
    country: "Thailand",
    description: "Sister group based in Bangkok.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 9,
    name: "MNL48",
    slug: "mnl48",
    country: "Philippines",
    description: "Sister group based in Manila.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 10,
    name: "TPE48",
    slug: "tpe48",
    country: "Taiwan",
    description: "Sister group based in Taipei.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 11,
    name: "TSH48",
    slug: "tsh48",
    country: "Japan",
    description: "Sister group from Tokushima.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 12,
    name: "CGM48",
    slug: "cgm48",
    country: "Thailand",
    description: "Sister group based in Chiang Mai.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 13,
    name: "KLP48",
    slug: "klp48",
    country: "Malaysia",
    description: "Sister group based in Kuala Lumpur.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 14,
    name: "SNH48",
    slug: "snh48",
    country: "China",
    description: "Sister group based in Shanghai.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 15,
    name: "GNZ48",
    slug: "gnz48",
    country: "China",
    description: "Sister group based in Guangzhou.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 16,
    name: "BEJ48",
    slug: "bej48",
    country: "China",
    description: "Sister group based in Beijing.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 17,
    name: "CKG48",
    slug: "ckg48",
    country: "China",
    description: "Sister group based in Chongqing.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
  {
    id: 18,
    name: "CGK48",
    slug: "cgk48",
    country: "Indonesia",
    description: "Sister group based in Cikampek.",
    bannerUrl: "",
    createdAt: BigInt(0),
  },
];

export const MOCK_POSTS: InternalPost[] = [
  {
    id: 1,
    title: "AKB48 Announces Major Summer Concert Tour 2026",
    content:
      "AKB48 has officially announced their highly anticipated summer concert tour across 10 cities in Japan...",
    thumbnailUrl: "",
    hashtags: ["#AKB48", "#Concert", "#2026"],
    likeCount: 342,
    viewCount: 15420,
    isLive: true,
    isVerified: true,
    isReported: false,
    createdAt: BigInt(Date.now() - 2 * 60 * 60 * 1000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 2 * 60 * 60 * 1000) * BigInt(1000000),
    authorPrincipal: null as any,
  },
  {
    id: 2,
    title: "JKT48 New Single 'Bintang Jatuh' Tops Indonesian Charts",
    content:
      "JKT48 released their newest single 'Bintang Jatuh' last Friday and it has already topped multiple Indonesian music charts...",
    thumbnailUrl: "",
    hashtags: ["#JKT48", "#NewSingle", "#Indonesia"],
    likeCount: 289,
    viewCount: 12300,
    isLive: true,
    isVerified: true,
    isReported: false,
    createdAt: BigInt(Date.now() - 5 * 60 * 60 * 1000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 5 * 60 * 60 * 1000) * BigInt(1000000),
    authorPrincipal: null as any,
  },
  {
    id: 3,
    title: "SKE48 Team S Full Formation Unveiled for Upcoming Stage",
    content:
      "SKE48 has revealed the complete lineup for their upcoming Team S stage performance scheduled for next month...",
    thumbnailUrl: "",
    hashtags: ["#SKE48", "#TeamS", "#Stage"],
    likeCount: 198,
    viewCount: 8750,
    isLive: true,
    isVerified: true,
    isReported: false,
    createdAt: BigInt(Date.now() - 8 * 60 * 60 * 1000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 8 * 60 * 60 * 1000) * BigInt(1000000),
    authorPrincipal: null as any,
  },
  {
    id: 4,
    title: "BNK48 Member Graduation Ceremony Recap",
    content:
      "The emotional graduation ceremony for BNK48's beloved member brought fans to tears across Thailand...",
    thumbnailUrl: "",
    hashtags: ["#BNK48", "#Graduation", "#Thailand"],
    likeCount: 567,
    viewCount: 23100,
    isLive: true,
    isVerified: true,
    isReported: false,
    createdAt: BigInt(Date.now() - 24 * 60 * 60 * 1000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 24 * 60 * 60 * 1000) * BigInt(1000000),
    authorPrincipal: null as any,
  },
  {
    id: 5,
    title: "HKT48 Drafts Top Talent in Annual Selection Event",
    content:
      "HKT48 conducted their annual draft event, welcoming fresh talent from across Kyushu region...",
    thumbnailUrl: "",
    hashtags: ["#HKT48", "#Draft", "#NewMembers"],
    likeCount: 156,
    viewCount: 6890,
    isLive: false,
    isVerified: false,
    isReported: false,
    createdAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1000000),
    authorPrincipal: null as any,
  },
  {
    id: 6,
    title: "RUMOR: AKB48 Captain to Announce Major Decision?",
    content:
      "Unconfirmed sources suggest that AKB48's captain may be about to make a significant announcement...",
    thumbnailUrl: "",
    hashtags: ["#AKB48", "#Rumor", "#Captain"],
    likeCount: 445,
    viewCount: 19200,
    isLive: false,
    isVerified: false,
    isReported: false,
    createdAt: BigInt(Date.now() - 3 * 60 * 60 * 1000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 3 * 60 * 60 * 1000) * BigInt(1000000),
    authorPrincipal: null as any,
  },
];

// Empty arrays — no mock threads or members shown by default
export const MOCK_THREADS: InternalThread[] = [];

export const MOCK_MEMBERS: InternalMember[] = [];

export const TRENDING_HASHTAGS = [
  "#AKB48",
  "#JKT48",
  "#BNK48",
  "#SKE48",
  "#HKT48",
  "#NMB48",
  "#SNH48",
  "#Senbatsu",
  "#Graduation",
  "#NewSingle",
  "#Concert",
  "#48Group",
];

export function formatRelativeTime(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1000000));
  const now = Date.now();
  const diff = now - ms;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}
