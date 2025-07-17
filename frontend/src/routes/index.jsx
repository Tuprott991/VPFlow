import { useRoutes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import { PrivateLayout } from "../layouts";
import OtherRoutes from "./OtherRoutes";

const Routes = () => {
  const element = useRoutes([
    ...PublicRoutes,
    {
      path: "/",
      element: <PrivateLayout />,
      children: [...PrivateRoutes],
    },
    ...OtherRoutes,
  ]);

  return element;
};

export default Routes;
