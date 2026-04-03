import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { MemberStatus } from "../backend.d";
import type { InternalGroup, InternalMember } from "../backend.d";

interface MemberCardProps {
  member: InternalMember;
  group?: InternalGroup;
  className?: string;
}

const STATUS_CONFIG = {
  [MemberStatus.active]: {
    label: "Active",
    className: "bg-green-600/20 text-green-400 border-green-600/30",
  },
  [MemberStatus.hiatus]: {
    label: "Hiatus",
    className: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  },
  [MemberStatus.graduated]: {
    label: "Graduated",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const MEMBER_GRADIENTS = [
  "linear-gradient(160deg, #1a0a1a 0%, #0d1b2a 100%)",
  "linear-gradient(160deg, #0a1a0d 0%, #0a0f1e 100%)",
  "linear-gradient(160deg, #1a0a0a 0%, #1a0a1a 100%)",
  "linear-gradient(160deg, #0a0f1e 0%, #1a1200 100%)",
];

export default function MemberCard({
  member,
  group,
  className,
}: MemberCardProps) {
  const gradient = MEMBER_GRADIENTS[member.id % MEMBER_GRADIENTS.length];
  const statusConf = STATUS_CONFIG[member.status];
  const memberHref = `/members/${member.id}`;

  return (
    <article
      className={cn(
        "group rounded-2xl border border-border bg-card overflow-hidden card-hover transition-all duration-300",
        className,
      )}
      data-ocid="member.card"
    >
      <div
        className="aspect-[3/4] overflow-hidden relative"
        style={{ background: gradient }}
      >
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-display font-bold text-primary"
              style={{
                background: "rgba(225,29,46,0.1)",
                border: "2px solid rgba(225,29,46,0.3)",
              }}
            >
              {member.name.charAt(0)}
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge
            className={cn("text-xs font-semibold border", statusConf.className)}
          >
            {statusConf.label}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-display font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {group?.name || `Group #${member.groupId}`}{" "}
            {member.team && `• ${member.team}`}
          </p>
        </div>

        {member.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {member.bio}
          </p>
        )}

        <a
          href={memberHref}
          data-ocid="member.button"
          className="block text-center py-1.5 px-3 rounded-lg text-xs font-semibold text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          View Profile
        </a>
      </div>
    </article>
  );
}
