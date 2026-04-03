import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { Filter, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { MemberStatus } from "../backend.d";
import MemberCard from "../components/MemberCard";
import SkeletonCard from "../components/SkeletonCard";
import { MOCK_GROUPS, MOCK_MEMBERS } from "../data/mockData";
import { useListGroups } from "../hooks/useBackend";

const STATUS_LABELS: Record<string, string> = {
  [MemberStatus.active]: "Active",
  [MemberStatus.hiatus]: "Hiatus",
  [MemberStatus.graduated]: "Graduated",
};

export default function MembersPage() {
  const { data: groups } = useListGroups();
  const displayGroups = groups?.length ? groups : MOCK_GROUPS;

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Use mock members (backend has no listMembers method)
  const members = MOCK_MEMBERS;

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        search === "" ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.team.toLowerCase().includes(search.toLowerCase());
      const matchGroup =
        groupFilter === "all" || m.groupId === Number(groupFilter);
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      return matchSearch && matchGroup && matchStatus;
    });
  }, [members, search, groupFilter, statusFilter]);

  const getGroup = (id: number) => displayGroups.find((g) => g.id === id);

  return (
    <div className="min-h-screen py-8" data-ocid="members.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="section-label mb-2">Database</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground">
            <span className="text-primary">48</span>MEMBER
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete database of all 48 Group members
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              data-ocid="members.search_input"
              className="pl-9 bg-card border-border"
            />
          </div>

          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger
              className="w-44 bg-card border-border"
              data-ocid="members.select"
            >
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {displayGroups.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-40 bg-card border-border"
              data-ocid="members.select"
            >
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing{" "}
          <span className="text-foreground font-semibold">
            {filtered.length}
          </span>{" "}
          members
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="members.empty_state">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              No members found
            </h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                data-ocid={`members.item.${i + 1}`}
              >
                <MemberCard member={member} group={getGroup(member.groupId)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
