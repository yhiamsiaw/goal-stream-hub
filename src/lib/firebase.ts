import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGqrugdmfTuYtgLyhpqnFckyXNRcTxegw",
  authDomain: "sports-38736.firebaseapp.com",
  projectId: "sports-38736",
  storageBucket: "sports-38736.firebasestorage.app",
  messagingSenderId: "326364198450",
  appId: "1:326364198450:web:71d916365735b6c6686e2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;