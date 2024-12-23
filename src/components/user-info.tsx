import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/providers/user-provider";
import { useAuth } from "@/providers/auth-provider";
import { Role } from "@/features/auth/types";

function UserInfo() {
  const { logout } = useAuth();
  const { user } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex gap-3 justify-center items-center">
      <p>{`${user?.firstName} ${user?.lastName}`}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={user?.photoURL} alt="Profile photo" />
              <AvatarFallback>FM</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 min-w-40">
              <p className="text-sm font-medium leading-none">{`${user?.firstName} ${user?.lastName}`}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={user?.role === Role.Manager ? "/dashboard/settings" : "/driver/edit"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            Log out
            <LogOut size={16} className="ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserInfo;
