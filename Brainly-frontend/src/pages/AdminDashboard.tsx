import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";

import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import {
  Users,
  FolderKanban,
  Link as LinkIcon,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  users: number;
  workspaces: number;
  links: number;
  todayUsers: number;
  todayLinks: number;
}

export default function AdminDashboard() {
  const navigate=useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}api/v1/admin/stats`, {
          withCredentials: true
        });

        setStats(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.log(err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor your Brainly platform activity
        </p>
      </div>

      <Separator />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))
        ) : (
          <>
            <AdminStatCard
              title="Total Users"
              value={stats?.users ?? 0}
              icon={<Users size={18} />}
            />

            <AdminStatCard
              title="Workspaces"
              value={stats?.workspaces ?? 0}
              icon={<FolderKanban size={18} />}
            />

            <AdminStatCard
              title="Total Links"
              value={stats?.links ?? 0}
              icon={<LinkIcon size={18} />}
            />

            <AdminStatCard
              title="Today Users"
              value={stats?.todayUsers ?? 0}
              subtitle="New signups today"
              icon={<TrendingUp size={18} />}
            />
          </>
        )}
      </div>
    </div>
  );
}
