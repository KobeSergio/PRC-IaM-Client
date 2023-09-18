import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getBlob,
} from "firebase/storage";
import { Inspection } from "@/types/Inspection";
import { Client } from "@/types/Client";
import { RO } from "@/types/RO";
import { OC } from "@/types/OC";
import { PRB } from "@/types/PRB";
import { ACD } from "@/types/ACD";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Firebase constants
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
const linksRef = collection(db, "links");

export default class Firebase {
  //GET: Checks if the link object in the database
  //returns the link object if it exists
  async getLinkObjectById(id: string) {
    const docRef = doc(db, "links", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  //GET: Get single inspection.
  //Returns inspection if successful, null if there is an error.
  async getInspection(inspection_id: string) {
    try {
      const docRef = doc(db, "inspections", inspection_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Inspection;

        // Create an array of promises
        const promises = [
          this.getClientDetails(data.client_details.client_id),
          this.getRODetails(data.ro_details.ro_id),
          this.getPRBDetails(data.prb_details.prb_id),
          this.getOCDetails(data.oc_details.oc_id),
          this.getACDDetails(data.acd_details.acd_id),
        ];

        // Wait for all promises to resolve
        const [client, ro, prb, oc, acd] = await Promise.all(promises);

        //Overrides firebase data with data from other collections
        if (client != null) data.client_details = client as Client;
        if (ro != null) data.ro_details = ro as RO;
        if (prb != null) data.prb_details = prb as PRB;
        if (oc != null) data.oc_details = oc as OC;
        if (acd != null) data.acd_details = acd as ACD;

        return data;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //GET: Get single client.
  //Returns client if successful, null if there is an error.
  async getClientDetails(client_id: string) {
    try {
      const docRef = doc(db, "clients", client_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Client;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //GET: Get single ro.
  //Returns ro if successful, null if there is an error.
  async getRODetails(ro_id: string) {
    try {
      const docRef = doc(db, "ro", ro_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as RO;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //GET: Get single prb.
  //Returns prb if successful, null if there is an error.
  async getPRBDetails(prb_id: string) {
    try {
      const docRef = doc(db, "prb", prb_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as PRB;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //GET: Get single oc.
  //Returns oc if successful, null if there is an error.
  async getOCDetails(oc_id: string) {
    try {
      const docRef = doc(db, "oc", oc_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as OC;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //GET: Get single acd.
  //Returns acd if successful, null if there is an error.
  async getACDDetails(acd_id: string) {
    try {
      const docRef = doc(db, "acd", acd_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as ACD;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //Storage: Uploads the file to the storage bucket
  async uploadFile(file: File, inspection_id: string, requirement: string) {
    const storageRef = ref(
      storage,
      `files/${inspection_id}/${requirement}-${file.name}}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => alert(`${error} - Failed to upload file.`),
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          return downloadURL;
        });
      }
    );
  }
}