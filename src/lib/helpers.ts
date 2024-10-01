import { CollectionNames, VehicleEvent } from "@/types";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/../firebase";

export type CreateDocOptions<T> = {
  collectionName: CollectionNames;
  data: T;
  managerUid: string;
};

export async function createDocument<T>({ collectionName, data, managerUid }: CreateDocOptions<T>) {
  await addDoc(collection(db, collectionName), {
    ...data,
    managerUid: managerUid,
  });
}

export type UpdateDocOptions<T> = {
  collectionName: CollectionNames;
  docUid: string;
  data: Partial<T>;
};

export async function updateDocument<T>({ collectionName, docUid, data }: UpdateDocOptions<T>) {
  const docRef = doc(db, collectionName, docUid);
  return await updateDoc(docRef, data);
}

export type GetDocsByManagerUidOptions = {
  collectionName: CollectionNames;
  managerUid: string;
};

export async function getDocumentsByManagerUid<T>({ collectionName, managerUid }: GetDocsByManagerUidOptions): Promise<T[]> {
  const docQuery = query(collection(db, collectionName), where("managerUid", "==", managerUid));
  const querySnapshot = await getDocs(docQuery);
  const documents: T[] = [];

  querySnapshot.forEach((doc) => {
    documents.push({ uid: doc.id, ...doc.data() } as T);
  });

  return documents;
}

export type GetDocsByUidOptions = {
  collectionName: CollectionNames;
  uids: string[];
};

export async function getDocumentsByUid<T>({ collectionName, uids }: GetDocsByUidOptions): Promise<T[]> {
  const documents: T[] = [];

  if (!uids.length) return documents;

  const docQuery = query(collection(db, collectionName), where("__name__", "in", uids));
  const querySnapshot = await getDocs(docQuery);

  querySnapshot.forEach((doc) => {
    documents.push({ uid: doc.id, ...doc.data() } as T);
  });

  return documents;
}

export type GetDocsByVehicleUidOptions = {
  collectionName: CollectionNames;
  vehicleUid: string;
};

export async function getDocumentsByVehicleUid<T extends VehicleEvent>({ collectionName, vehicleUid }: GetDocsByVehicleUidOptions): Promise<T[]> {
  const docQuery = query(collection(db, collectionName), where("vehicleUid", "==", vehicleUid));
  const querySnapshot = await getDocs(docQuery);
  const documents: T[] = [];

  querySnapshot.forEach((doc) => {
    documents.push({ uid: doc.id, ...doc.data() } as T);
  });

  return documents;
}

export type DeleteDocOptions = {
  collectionName: CollectionNames;
  docUid: string;
};

export async function deleteDocument({ collectionName, docUid }: DeleteDocOptions) {
  const docRef = doc(db, collectionName, docUid);
  await deleteDoc(docRef);
}
