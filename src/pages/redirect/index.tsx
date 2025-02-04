import * as React from "react";
import { useNavigate } from "react-router-dom";
interface IRedirectProps {}

const Redirect: React.FunctionComponent<IRedirectProps> = (props) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/login");
  }, [navigate, "/login"]);

  return null;
};

export default Redirect;
