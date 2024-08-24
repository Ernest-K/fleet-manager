import DashboardNavbar from "@/features/dashboard/components/dashboard-navbar";
import Menu from "@/components/menu";
import { LayoutDashboard, Car, UsersRound, UserRoundPen, TextSearch, Wrench, BadgeAlert, Settings } from "lucide-react";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <DashboardNavbar />
      <div className="container flex gap-6">
        <Menu
          links={[
            {
              title: "Dashboard",
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: "Drivers",
              url: '/dashboard/drivers',
              icon: UsersRound,
            },
            {
              title: "Vehicles",
              url: '/dashboard/vehicles',
              icon: Car,
            },
            {
              title: "Assignments",
              url: '/dashboard/assignments',
              icon: UserRoundPen,
            },
            {
              title: "Inspections",
              url: '/dashboard/inspections',
              icon: TextSearch,
            },
            {
              title: "Services",
              url: '/dashboard/services',
              icon: Wrench,
            },
            {
              title: "Issues",
              url: '/dashboard/issues',
              icon: BadgeAlert,
            },
            {
              title: "Settings",
              url: '/dashboard/settings',
              icon: Settings,
            },
          ]}
        />
      
      <main className="pt-3 w-full">{children}</main>
      </div>
    </div>
  );
};
