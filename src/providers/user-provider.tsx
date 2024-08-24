import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../providers/auth-provider";
import { User } from "@/features/auth/types";

interface UserContextProps {
  user: User | null;
}

const UserContext = createContext<UserContextProps>({ user: null });

export function UserProvider({ children }: { children: ReactNode }) {
  const { authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (authUser) {
      const fetchUser = async () => {
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        setUser(userDoc.exists() ? (userDoc.data() as User) : null);
      };

      fetchUser();
    } else {
      setUser(null);
    }
  }, [authUser]);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
