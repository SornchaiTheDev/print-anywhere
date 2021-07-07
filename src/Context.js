import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "./firebase";
const User = createContext();

export const useUser = () => useContext(User);

function Context({ children }) {
  const [user, setUser] = useState(null);

  const getUser = async (uid) => {
    const doc = await firestore().collection("users").doc(uid).get();
    setUser((prev) => ({ ...prev, ...doc.data() }));
  };

  const removeQuota = () =>
    setUser((prev) => ({ ...prev, quota: prev.quota - 1 }));

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user !== null) {
        getUser(user.uid);
        setUser(user);
      }
    });
  }, []);
  const value = {
    user,
    getUser,
    removeQuota,
  };
  return <User.Provider value={value}>{children}</User.Provider>;
}

export default Context;
