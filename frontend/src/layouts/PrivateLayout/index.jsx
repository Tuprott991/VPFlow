"use client";

import { Outlet } from "react-router-dom";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
} from "@mui/material";
import { Info, MoreVert } from "@mui/icons-material";
import Sidebar from "./sidebar";

const PrivateLayout = () => {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
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
                                List Of Workflows
                            </Typography>
                            <IconButton size="small">
                                <Info fontSize="small" />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, backgroundColor: "#4FC3F7" }}>T</Avatar>
                            <IconButton size="small">
                                <MoreVert />
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
