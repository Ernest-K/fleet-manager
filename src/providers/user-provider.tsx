import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../providers/auth-provider";
import { Role, User } from "@/features/auth/types";
import { Driver } from "@/features/drivers/types";
import { CollectionNames } from "@/types";

interface UserContextProps {
  user: User | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({ user: null, refreshUser: async () => {} });

export function UserProvider({ children }: { children: ReactNode }) {
  const { authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    if (authUser) {
      const userDoc = await getDoc(doc(db, CollectionNames.Users, authUser.uid));
      setUser(userDoc.exists() ? (userDoc.data() as User) : null);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authUser]);

  return <UserContext.Provider value={{ user, refreshUser: fetchUser }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
