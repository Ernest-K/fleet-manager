import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../providers/auth-provider";
import { Role, User } from "@/features/auth/types";
import { Driver } from "@/features/drivers/types";
import { CollectionNames } from "@/types";
import { any } from "zod";

interface UserContextProps {
  user: User | null;
  setUser: (u: User) => void;
  refreshUser: () => Promise<void>;
  getUser: (userUid: string) => Promise<User | null>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: (u: User) => {},
  refreshUser: async () => {},
  getUser: async () => null,
});

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

  const getUser = async (userUid: string) => {
    const userDoc = await getDoc(doc(db, CollectionNames.Users, userUid));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  };

  useEffect(() => {
    fetchUser();
  }, [authUser]);

  // const fetchUser = async () => {
  //   if (authUser) {
  //     console.log("Auth User:", authUser);

  //     try {
  //       const userDoc = await getDoc(doc(db, CollectionNames.Users, authUser.uid));

  //       if (userDoc.exists()) {
  //         const userData = userDoc.data() as User;
  //         console.log("User Data from Firestore:", userData); // Check if the document contains the correct structure
  //         setUser(userData);
  //       } else {
  //         console.warn("No such document!");
  //         setUser(null);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       setUser(null);
  //     }
  //   } else {
  //     setUser(null);
  //   }
  // };

  // useEffect(() => {
  //   setLoading(true); // Set loading before fetching the user data
  //   fetchUser().finally(() => setLoading(false)); // Stop loading after the user is fetched
  // }, [authUser]);

  return <UserContext.Provider value={{ user, setUser, refreshUser: fetchUser, getUser }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
