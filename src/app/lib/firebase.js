import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyC1lqVvrd1m5tYZ6qjpssJg31pCoyew8FM',
  authDomain: 'qaprocess-53bda.firebaseapp.com',
  projectId: 'qaprocess-53bda',
  storageBucket: 'qaprocess-53bda.appspot.com',
  messagingSenderId: '444674641664',
  appId: '1:444674641664:web:215bb9dcbf10efe69f6de5',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
