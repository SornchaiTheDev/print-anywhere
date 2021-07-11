import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "./firebase";
const User = createContext();

export const useUser = () => useContext(User);

function Context({ children }) {
  const [user, setUser] = useState(null);

  const removeQuota = () =>
    setUser((prev) => ({ ...prev, quota: prev.quota - 1 }));

  const setQuota = (quota) => {
    setUser((prev) => ({ ...prev, quota }));
  };
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user !== null) {
        setUser(user);
      }
    });
  }, []);
  const value = {
    user,
    setUser,
    setQuota,
    removeQuota,
  };
  return <User.Provider value={value}>{children}</User.Provider>;
}

export default Context;
