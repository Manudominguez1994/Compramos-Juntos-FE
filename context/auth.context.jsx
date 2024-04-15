import { createContext, useEffect, useState } from "react";
import service from "../src/services/service.config";
import Spinner from "react-bootstrap/Spinner";

const AuthContext = createContext();

function AuthWrapper(props) {
  const [isUserActived, setIsUserActived] = useState(false);
  const [ActiveUserId, setActiveUserId] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    setIsPageLoading(true);

    try {
      const response = await service.get("/auth/verify");
      //   console.log(response);

      setIsUserActived(true);
      setActiveUserId(response.data._id);
      setIsPageLoading(false);
    } catch (error) {
      console.log(error);
      setIsUserActived(false);
      setActiveUserId(null);
      setIsPageLoading(false);
    }
  };

  const handdleLogout = () => {
    localStorage.removeItem("authToken");
    verifyToken();
  };

  const passedContext = {
    verifyToken,
    isUserActived,
    ActiveUserId,
    handdleLogout,
  };

  if (isPageLoading === true) {
    return (
      <Spinner animation="border" role="status" style={{color:"#F92B42"}}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
