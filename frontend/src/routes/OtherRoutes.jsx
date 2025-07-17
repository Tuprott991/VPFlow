import { NotFoundPage } from "@/pages/OtherPages";
// import { UnauthorizedPage } from "@/pages/OtherPages";
// import { ComingSoonPage } from "@/pages/OtherPages"; // nếu có thêm sau này

const OtherRoutes = [
    {
        path: "*",
        element: <NotFoundPage />,
    },
    // {
    //   path: "/unauthorized",
    //   element: <UnauthorizedPage />,
    // },
    // {
    //   path: "/coming-soon",
    //   element: <ComingSoonPage />,
    // },
];

export default OtherRoutes;
