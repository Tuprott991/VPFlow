"use client"

import { useState } from "react"
import { Box, Typography, Button, Card, CardContent, IconButton, Avatar, Paper } from "@mui/material"
import { FilterList, Sort, Info, MoreVert, ExpandMore } from "@mui/icons-material"

// Sample feedback data
const feedbackData = [
    {
        id: 1,
        title: "Feedback 1",
        subtitle: "Report the problem",
        content: "The bottleneck of open bank account workflow is inaccurate",
        from: "LXThanh",
        role: "director",
        status: "Recieved",
        statusColor: "#1976d2", // Blue
    },
    {
        id: 2,
        title: "Feedback 2",
        subtitle: "Report the AI chat bot",
        content: "The chat bot is malfunction",
        from: "NgZun",
        role: "Banker",
        status: "Implemented",
        statusColor: "#2e7d32", // Green
    },
    {
        id: 3,
        title: "Feedback 3",
        subtitle: "Report the system",
        content: "The system is wonderful",
        from: "NhPham",
        role: "Banker",
        status: "In Progress",
        statusColor: "#f57c00", // Orange
    },
]

const FeedbackCard = ({ feedback }) => {
    const [statusAnchorEl, setStatusAnchorEl] = useState(null)

    const handleStatusClick = (event) => {
        setStatusAnchorEl(event.currentTarget)
    }

    const handleStatusClose = () => {
        setStatusAnchorEl(null)
    }

    return (
        <Card
            sx={{
                mb: 3,
                backgroundColor: "#faf5e6", // Light beige background
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#2e7d32", // Green color
                                fontWeight: "bold",
                                mb: 0.5,
                            }}
                        >
                            {feedback.title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: "bold",
                                color: "#333",
                            }}
                        >
                            Title: {feedback.subtitle}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" sx={{ color: "#666", mr: 1 }}>
                            from {feedback.from} ({feedback.role})
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            endIcon={<ExpandMore />}
                            onClick={handleStatusClick}
                            sx={{
                                backgroundColor: feedback.statusColor,
                                color: "white",
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                    backgroundColor: feedback.statusColor,
                                    opacity: 0.9,
                                },
                            }}
                        >
                            {feedback.status}
                        </Button>
                    </Box>
                </Box>

                {/* Content */}
                <Paper
                    sx={{
                        p: 2,
                        backgroundColor: "white",
                        borderRadius: 2,
                        mb: 2,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography variant="body1" sx={{ color: "#333" }}>
                        {feedback.content}
                    </Typography>
                </Paper>

                {/* View Detail Button */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{
                            backgroundColor: "#333",
                            color: "white",
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": {
                                backgroundColor: "#555",
                            },
                        }}
                    >
                        View detail
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}

export default function PainPointFeedbacksPage() {
    const [sortBy, setSortBy] = useState("Lastest")

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 3,
                    backgroundColor: "white",
                    borderBottom: "1px solid #e0e0e0",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", mr: 1 }}>
                        Pain Point Feedbacks
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
            </Box>

            {/* Controls */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 3,
                    backgroundColor: "white",
                    borderBottom: "1px solid #e0e0e0",
                }}
            >
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Sort />}
                        sx={{
                            textTransform: "none",
                            color: "#666",
                            borderColor: "#ddd",
                        }}
                    >
                        Sorted by {sortBy}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FilterList />}
                        sx={{
                            textTransform: "none",
                            color: "#666",
                            borderColor: "#ddd",
                        }}
                    >
                        Filter
                    </Button>
                </Box>

                <Button
                    variant="text"
                    size="small"
                    sx={{
                        textTransform: "none",
                        color: "#666",
                    }}
                >
                    Clear All
                </Button>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3 }}>
                {feedbackData.map((feedback) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} />
                ))}
            </Box>
        </Box>
    )
}
