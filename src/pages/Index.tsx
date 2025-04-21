import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This component is no longer needed as we redirect to Dashboard
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  
  return null;
};

export default Index;
