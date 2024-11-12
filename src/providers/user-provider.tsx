import React, { useCallback } from "react";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import { useAuth } from "@/providers/auth-provider";
import { User } from "@/features/auth/types";
import { CollectionNames } from "@/types";

interface UserContextProps {
  user: User | null;
  refreshUser: () => Promise<void>;
  getUser: (userUid: string) => Promise<User | null>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  refreshUser: async () => {},
  getUser: async () => null,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    if (authUser) {
      const userDoc = await getDoc(doc(db, CollectionNames.Users, authUser.uid));
      setUser(userDoc.exists() ? (userDoc.data() as User) : null);
    } else {
      setUser(null);
    }
  }, [authUser]);

  const getUser = async (userUid: string) => {
    const userDoc = await getDoc(doc(db, CollectionNames.Users, userUid));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  };

  useEffect(() => {
    fetchUser();
  }, [authUser, fetchUser]);

  return <UserContext.Provider value={{ user, refreshUser: fetchUser, getUser }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
