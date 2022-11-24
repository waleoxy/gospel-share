import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3aUm0LrtYS9711Vcp7FNqd7gQVzcD0cw",
  authDomain: "gospelshare.firebaseapp.com",
  projectId: "gospelshare",
  storageBucket: "gospelshare.appspot.com",
  messagingSenderId: "288312389647",
  appId: "1:288312389647:web:8ddf9fa9de81a23995737a",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
