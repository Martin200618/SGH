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
      {children}

      <Profile />
    </div>
  );
}
