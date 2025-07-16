"use client";

import { useNavigate, NavLink } from "react-router-dom";
import {
    Box,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Typography,
    Avatar,
    Divider,
    IconButton,
} from "@mui/material";
import {
    KeyboardCommandKey,
    BookmarkBorder,
} from "@mui/icons-material";
import { PiGraph } from "react-icons/pi";
import { BsPatchQuestion } from "react-icons/bs";
import { TbMailQuestion, TbLogout } from "react-icons/tb";

const drawerWidth = 240;

const VPFlowLogo = () => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            backgroundColor: "#019C4B",
            overflow: "hidden",
        }}
    >
        <Box
            sx={{
                width: 32,
                height: 32,
                backgroundColor: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1,
                flexShrink: 0,
            }}
        >
            <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="6" cy="6" r="2" fill="#2E8B57" />
                <circle cx="14" cy="6" r="2" fill="#2E8B57" />
                <circle cx="10" cy="14" r="2" fill="#2E8B57" />
                <line x1="6" y1="6" x2="14" y2="6" stroke="#2E8B57" strokeWidth="1" />
                <line x1="6" y1="6" x2="10" y2="14" stroke="#2E8B57" strokeWidth="1" />
                <line x1="14" y1="6" x2="10" y2="14" stroke="#2E8B57" strokeWidth="1" />
            </svg>
        </Box>
        <Typography
            variant="h6"
            sx={{
                fontWeight: "bold",
                color: "white",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
            }}
        >
            <span style={{ color: "#D64545" }}>VP</span>Flow
        </Typography>
    </Box>
);

const Sidebar = () => {
    const navigate = useNavigate();
    const handleClickLogout = () => {
        console.log("Logout clicked");
        navigate("/login");
    };

    const sidebarItems = [
        {
            text: "Quick actions",
            icon: <KeyboardCommandKey />,
            shortcut: "K",
        },
        {
            text: "List of workflows",
            icon: <BookmarkBorder />,
            link: "/list-of-workflows",
        },
        {
            text: "Workflow with AI",
            icon: <PiGraph size={24} />,
            link: "/workflow-with-ai",
        },
        {
            text: "Pain Point Feedbacks",
            icon: <TbMailQuestion size={24} />,
            link: "/pain-point-feedbacks",
        },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    height: "100vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    border: "none",
                    backgroundColor: "#FBFBFB",
                    borderRight: "1px solid #EEEFF1",
                },
            }}
        >
            <VPFlowLogo />

            <List sx={{ overflowX: "hidden" }}>
                {sidebarItems.map((item, index) => (
                    <Box key={index}>
                        <NavLink
                            to={item.link || "#"}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <ListItemButton
                                sx={{
                                    borderRadius: 1,
                                    mb: 0.5,
                                    overflowX: "hidden",
                                    maxWidth: "100%",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    "&.Mui-selected": {
                                        backgroundColor: "#e3f2fd",
                                        "&:hover": {
                                            backgroundColor: "#e3f2fd",
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: "0.875rem",
                                        noWrap: true,
                                        fontWeight: 600,
                                    }}
                                />
                                {item.shortcut && (
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary" }}
                                    >
                                        {item.shortcut}
                                    </Typography>
                                )}
                            </ListItemButton>
                        </NavLink>
                    </Box>
                ))}
            </List>

            <Box sx={{ mt: "auto", pb: 2 }}>
                <Divider sx={{ mb: 2 }} />

                <ListItemButton
                    sx={{
                        borderRadius: 1,
                        mb: 2,
                        overflowX: "hidden",
                        maxWidth: "100%",
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <BsPatchQuestion size={24} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Help and first steps"
                        primaryTypographyProps={{ fontSize: "0.875rem", noWrap: true, fontWeight: 550 }}
                    />
                </ListItemButton>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 2,
                        pr: 1,
                        overflow: "hidden",
                        maxWidth: "100%",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 24,
                            height: 24,
                            bgcolor: "#4FC3F7",
                            mr: 1.5,
                            flexShrink: 0,
                            fontSize: 14,
                        }}
                    >
                        T
                    </Avatar>

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flexGrow: 1,
                        }}
                    >
                        Tu Ku
                    </Typography>

                    <IconButton
                        size="small"
                        sx={{
                            color: "warning.main",
                            ml: 1,
                            flexShrink: 0,
                        }}
                        onClick={() => handleClickLogout()}
                    >
                        <TbLogout size={20} />
                    </IconButton>
                </Box>
            </Box>
        </Drawer >
    );
};

export default Sidebar;
