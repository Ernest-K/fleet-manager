import Menu from "@/components/menu";
import ProtectedRoute from "@/components/protected-route";
import { LayoutDashboard, Car, UsersRound, UserRoundPen, TextSearch, Wrench, BadgeAlert, Settings } from "lucide-react";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import UserInfo from "@/components/user-info";

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="min-h-screen">
        <Navbar>
          <h1 className="invisible md:visible basis-0 md:basis-auto font-semibold text-lg">Fleet Manager</h1>
          <div className="flex gap-8 justify-center items-center">
            <UserInfo />
            <ThemeToggle />
          </div>
        </Navbar>
        <div className="container flex gap-6">
          <Menu
            links={[
              {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
              },
              {
                title: "Drivers",
                url: "/dashboard/drivers",
                icon: UsersRound,
              },
              {
                title: "Vehicles",
                url: "/dashboard/vehicles",
                icon: Car,
              },
              {
                title: "Assignments",
                url: "/dashboard/assignments",
                icon: UserRoundPen,
              },
              {
                title: "Inspections",
                url: "/dashboard/inspections",
                icon: TextSearch,
              },
              {
                title: "Services",
                url: "/dashboard/services",
                icon: Wrench,
              },
              {
                title: "Issues",
                url: "/dashboard/issues",
                icon: BadgeAlert,
              },
              {
                title: "Settings",
                url: "/dashboard/settings",
                icon: Settings,
              },
            ]}
          />

          <main className="pt-3 w-full">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
