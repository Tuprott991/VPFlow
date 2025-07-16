"use client";

import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Paper,
} from "@mui/material";
import {
    FilterList,
    Sort,
    ExpandMore
} from "@mui/icons-material";
import {
    feedbackData
} from "@/data/mock_data/feedbackData.js";

import { useNavigate } from "react-router-dom";

const FeedbackCard = ({ feedback }) => {
    const navigate = useNavigate();
    return (
        <Card
            sx={{
                mb: 3,
                backgroundColor: "#faf5e6",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ color: "#2e7d32", fontWeight: "bold", mb: 0.5 }}
                        >
                            {feedback.title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "#333" }}
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
                        onClick={() => navigate("/feedback-details")}
                    >
                        View detail
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function PainPointFeedbacksPage() {
    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
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
                        Sorted by Latest
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

            <Box sx={{ p: 3 }}>
                {feedbackData.map((feedback) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} />
                ))}
            </Box>
        </Box>
    );
}
