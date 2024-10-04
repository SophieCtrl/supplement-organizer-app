import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";

const IsPrivate = ({ children }) => {
  const { isLoggedIn, authenticateUser, isLoading } = useContext(AuthContext);

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? children : null;
};

export default IsPrivate;
