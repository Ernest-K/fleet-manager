import { FieldValue } from "firebase/firestore";

export type EntityDocument = {
  uid: string;
  entityUid: string;
  label: string;
  fileName: string;
  fileSize: number;
  url: string;
  createdAt: any;
};
