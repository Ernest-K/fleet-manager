import Menu from "@/components/menu";
import ProtectedRoute from "@/components/protected-route";
import { LayoutDashboard, Car, UsersRound, UserRoundPen, TextSearch, Wrench, BadgeAlert, Settings, House } from "lucide-react";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import UserInfo from "@/components/user-info";
import { Role } from "@/features/auth/types";

type DriverLayoutProps = {
  children: ReactNode;
};

export const DriverLayout = ({ children }: DriverLayoutProps) => {
  return (
    <ProtectedRoute allowedRoles={[Role.Driver]}>
      <div className="min-h-screen">
        <Navbar>
          <h1 className="invisible md:visible basis-0 md:basis-auto font-semibold text-lg">Fleet Manager</h1>
          <div className="flex gap-6 justify-center items-center">
            <UserInfo />
            <ThemeToggle />
          </div>
        </Navbar>
        <div className="container flex gap-6">
          <Menu
            links={[
              {
                title: "Home",
                url: "/driver",
                icon: House,
              },
              {
                title: "Settings",
                url: "/driver/edit",
                icon: Settings,
              },
            ]}
          />
          <main className="pt-6 w-full">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
