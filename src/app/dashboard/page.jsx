import { Suspense } from "react";
import Dashboard from "@/components/Dashboard";
import Loading from "@/components/Loading";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 hide-scrollbar">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
