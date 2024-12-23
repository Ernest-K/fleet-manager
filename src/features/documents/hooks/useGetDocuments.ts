import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/../firebase";
import { EntityDocument } from "@/features/documents/types";
import { CollectionNames } from "@/types";

type getDocumentsOptions = {
  entityUid: string;
};

const getDocuments = async ({ entityUid }: getDocumentsOptions) => {
  const documentsQuery = query(collection(db, CollectionNames.Documents), where("entityUid", "==", entityUid));
  const querySnapshot = await getDocs(documentsQuery);
  return querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as EntityDocument));
};

export const useGetDocuments = ({ entityUid }: getDocumentsOptions) => {
  return useQuery({
    queryFn: () => getDocuments({ entityUid }),
    queryKey: ["documents", entityUid],
    enabled: !!entityUid,
  });
};
