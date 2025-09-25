import Sidebar from "@/components/dashboard/Sidebar";
import Profile from "@/components/dashboard/Profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-60 flex-1">
        {children}
      </div>
      <Profile />
    </div>
  );
}
