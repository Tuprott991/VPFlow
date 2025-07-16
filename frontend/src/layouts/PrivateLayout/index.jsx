"use client";

import {
    Outlet,
    useLocation
} from "react-router-dom";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import Sidebar from "./sidebar";

const formatTitle = (segment) => {
    if (!segment) return "Dashboard";
    return segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


const PrivateLayout = () => {
    const location = useLocation();
    const segments = location.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const titlePage = formatTitle(lastSegment);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#ffffff",
                }}
            >
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        backgroundColor: "white",
                        borderBottom: "1px solid #EEEFF1",
                        color: "text.primary",
                    }}
                >
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                                {titlePage}
                            </Typography>
                            <IconButton size="small">
                                <Info fontSize="small" />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default PrivateLayout;
