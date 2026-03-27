"use client";

import { useMe } from "@/hooks/useMe";

export default function DashboardPage() {
  const { data, isLoading } = useMe();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}