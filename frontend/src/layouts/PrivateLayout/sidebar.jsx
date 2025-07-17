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
    IconButton,
    TextField
} from "@mui/material";
import {
    KeyboardCommandKey,
    BookmarkBorder,
} from "@mui/icons-material";
import { PiGraph } from "react-icons/pi";
import { BsPatchQuestion } from "react-icons/bs";
import { TbMailQuestion, TbLogout } from "react-icons/tb";

const drawerWidth = 200;

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
            <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#019C4B", py: 1.5, px: 1 }}>
                <img
                    src="/branch_logo.png"
                    alt="VPFlow Logo"
                    style={{
                        objectFit: "cover",
                        width: '100%',
                    }}
                />
            </Box>

            <List sx={{ overflowX: "hidden", px: 1 }}>
                {sidebarItems.map((item, index) => (
                    <Box key={index}>
                        {item.text === "Quick actions" ? (
                            <Box sx={{ px: 0.5, py: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search..."
                                    variant="outlined"
                                />
                            </Box>
                        ) : (
                            <NavLink
                                to={item.link || "#"}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <ListItemButton
                                    sx={{
                                        px: 0.5,
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
                                            fontSize: "0.75rem",
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
                            </NavLink>)}
                    </Box>
                ))}
            </List>

            <Box sx={{ mt: "auto", pb: 1, px: 1 }}>
                <NavLink
                    to="/helps-and-first-step"
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <ListItemButton
                        sx={{
                            px: 0.5,
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
                            primaryTypographyProps={{ fontSize: "0.75rem", noWrap: true, fontWeight: 550 }}
                        />
                    </ListItemButton>
                </NavLink>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 0.5,
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
                            color: "error.main",
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
