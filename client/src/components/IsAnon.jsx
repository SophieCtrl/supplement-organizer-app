import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";

const IsAnon = ({ children }) => {
  const { isLoggedIn, isLoading, authenticateUser } = useContext(AuthContext);

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  if (isLoading) return <p>Loading ...</p>;

  return !isLoggedIn ? children : null;
};

export default IsAnon;
