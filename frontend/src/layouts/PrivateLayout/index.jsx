"use client";

import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./sidebar";

const PrivateLayout = () => {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default PrivateLayout;
