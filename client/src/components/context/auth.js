import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    role: "",
    token: "", // Make sure to include token in initial state if you plan to use it
  });

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsedData = JSON.parse(data);
      setAuth({
        user: parsedData.user,
        role: parsedData.role || "", // Set default values if not present
        token: parsedData.token || "",
      });
    }
  }, []); // Empty dependency array to run only once on mount

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth, AuthProvider };
