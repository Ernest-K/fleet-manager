import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/providers/user-provider";
import { Icons } from "@/components/ui/icons";

interface ProtectedProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function Protected({ children, allowedRoles }: ProtectedProps) {
  const { authUser, loading } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authUser && !loading) {
      router.push("/auth");
    } else if (user) {
      if (user.role && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [authUser, user, allowedRoles, router, loading]);

  if (loading || !user) {
    return LoadingScreen();
  }

  if (user.role && !allowedRoles.includes(user.role)) {
    return LoadingScreen();
  }

  return <>{children}</>;
}

const LoadingScreen = () => (
  <div className="min-h-screen flex justify-center items-center">
    <Icons.spinner className="mr-2 animate-spin" />
    Loading
  </div>
);
