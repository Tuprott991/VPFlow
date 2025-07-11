import { useRoutes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
// import PrivateRoutes from "./PrivateRoutes";

const Routes = () => {
  const element = useRoutes([...PublicRoutes]);

  return element;
};

export default Routes;
