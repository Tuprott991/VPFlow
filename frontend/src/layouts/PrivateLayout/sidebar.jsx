"use client";

import {
    Box,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Typography,
    Collapse,
    Badge,
    Avatar,
    Divider,
    IconButton,
} from "@mui/material";
import {
    ExpandLess,
    ExpandMore,
    KeyboardCommandKey,
    BookmarkBorder,
    Star,
    Group,
    Help,
} from "@mui/icons-material";
import { useState } from "react";

const drawerWidth = 280;

const VPFlowLogo = () => (
    <Box sx={{ display: "flex", alignItems: "center", p: 2, backgroundColor: "#2E8B57" }}>
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
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            <span style={{ color: "#D64545" }}>VP</span>Flow
        </Typography>
    </Box>
);

const Sidebar = () => {
    const [workflowExpanded, setWorkflowExpanded] = useState(false);

    const sidebarItems = [
        {
            text: "Quick actions",
            icon: <KeyboardCommandKey />,
            shortcut: "K",
            divider: true,
        },
        {
            text: "List of workflows",
            icon: <BookmarkBorder />,
            selected: true,
        },
        {
            text: "Workflow with AI",
            icon: <Star />,
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
                    boxSizing: "border-box",
                    border: "none",
                    backgroundColor: "#fafafa",
                },
            }}
        >
            <VPFlowLogo />

            <List sx={{ px: 2 }}>
                {sidebarItems.map((item, index) => (
                    <Box key={index}>
                        <ListItemButton
                            selected={item.selected}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                "&.Mui-selected": {
                                    backgroundColor: "#e3f2fd",
                                    "&:hover": {
                                        backgroundColor: "#e3f2fd",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.875rem" }} />
                            {item.shortcut && (
                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                    {item.shortcut}
                                </Typography>
                            )}
                        </ListItemButton>
                        {item.divider && <Divider sx={{ my: 1 }} />}
                    </Box>
                ))}

                <ListItemButton onClick={() => setWorkflowExpanded(!workflowExpanded)} sx={{ borderRadius: 1, mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <BookmarkBorder />
                    </ListItemIcon>
                    <ListItemText primary="Workflow 1" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                    {workflowExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={workflowExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4, borderRadius: 1 }}>
                            <ListItemText primary="Workflow 2" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ px: 2, color: "text.secondary", fontWeight: 500 }}>
                    Records
                </Typography>

                <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <Group />
                    </ListItemIcon>
                    <ListItemText primary="Pain Point Feedbacks" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                </ListItemButton>
            </List>

            <Box sx={{ mt: "auto", p: 2 }}>
                <ListItemButton sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <Group />
                    </ListItemIcon>
                    <ListItemText primary="Invite teammates" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                </ListItemButton>

                <ListItemButton sx={{ borderRadius: 1, mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <Help />
                    </ListItemIcon>
                    <ListItemText primary="Help and first steps" primaryTypographyProps={{ fontSize: "0.875rem" }} />
                    <Badge badgeContent="0/6" color="primary" />
                </ListItemButton>

                <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: "#4FC3F7", mr: 1 }}>T</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Tu Ku
                    </Typography>
                    <IconButton size="small" sx={{ ml: "auto" }}>
                        <ExpandMore />
                    </IconButton>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
