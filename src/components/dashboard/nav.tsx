"use client";

import { User } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Home, Settings, Users } from "lucide-react";

interface DashboardNavProps {
  user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="w-64 bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-gray-400 text-sm">Welcome, {user.name}</p>
      </div>
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
        {user.role === "admin" && (
          <Link
            href="/dashboard/users"
            className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
          >
            <Users size={20} />
            <span>Users</span>
          </Link>
        )}
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
      <div className="absolute bottom-4">
        <Button
          variant="ghost"
          className="text-white hover:text-gray-300"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
