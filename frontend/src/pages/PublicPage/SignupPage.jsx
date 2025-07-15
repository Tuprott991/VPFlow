"use client"

import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Link,
    Paper,
    Grid,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

// Custom theme with VPFlow colors
const theme = createTheme({
    palette: {
        primary: {
            main: "#2E8B57", // Green color
        },
        secondary: {
            main: "#D64545", // Red color
        },
    },
})

const VPFlowLogo = () => (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
        {/* Circular logo with interconnected dots */}
        <Box
            sx={{
                width: 64,
                height: 64,
                backgroundColor: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
            }}
        >
            <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="12" cy="12" r="3" fill="#2E8B57" />
                <circle cx="28" cy="12" r="3" fill="#2E8B57" />
                <circle cx="20" cy="28" r="3" fill="#2E8B57" />
                <line x1="12" y1="12" x2="28" y2="12" stroke="#2E8B57" strokeWidth="2" />
                <line x1="12" y1="12" x2="20" y2="28" stroke="#2E8B57" strokeWidth="2" />
                <line x1="28" y1="12" x2="20" y2="28" stroke="#2E8B57" strokeWidth="2" />
            </svg>
        </Box>

        {/* Brand name */}
        <Typography variant="h3" component="div" sx={{ fontWeight: "bold" }}>
            <span style={{ color: "#D64545" }}>VP</span>
            <span style={{ color: "white" }}>Flow</span>
            <sup style={{ fontSize: "0.6em" }}>®</sup>
        </Typography>
    </Box>
)

export default function SignupPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("Login attempt:", formData)
        navigate("/list-of-workflows")
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: "100vh",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                }}
            >
                {/* Background with diagonal sections */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        zIndex: 0,
                    }}
                >
                    {/* White section */}
                    <Box sx={{ flex: 1, backgroundColor: "#f5f5f5" }} />

                    {/* Red diagonal stripe */}
                    <Box
                        sx={{
                            width: "128px",
                            backgroundColor: "#D64545",
                            transform: "skewX(12deg)",
                            transformOrigin: "top",
                        }}
                    />

                    {/* Green section */}
                    <Box sx={{ flex: 1, backgroundColor: "#2E8B57" }} />
                </Box>

                {/* Content */}
                <Grid container sx={{ position: "relative", zIndex: 1 }}>
                    {/* Left side - Login Form */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Container
                            maxWidth="sm"
                            sx={{
                                height: "100vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                px: 4,
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    width: "100%",
                                    maxWidth: 400,
                                    backgroundColor: "transparent",
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "#1a1a1a",
                                        mb: 4,
                                    }}
                                >
                                    Welcome back!
                                </Typography>

                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                    <Typography variant="body2" sx={{ mb: 1, color: "#666", fontWeight: 500 }}>
                                        Email address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        type="email"
                                        placeholder="Enter your name"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            mb: 3,
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "white",
                                                "& fieldset": {
                                                    borderColor: "#d1d5db",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#2E8B57",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#2E8B57",
                                                },
                                            },
                                        }}
                                    />

                                    <Typography variant="body2" sx={{ mb: 1, color: "#666", fontWeight: 500 }}>
                                        Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            mb: 2,
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "white",
                                                "& fieldset": {
                                                    borderColor: "#d1d5db",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#2E8B57",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#2E8B57",
                                                },
                                            },
                                        }}
                                    />

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                sx={{
                                                    color: "#666",
                                                    "&.Mui-checked": {
                                                        color: "#2E8B57",
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Remember me
                                            </Typography>
                                        }
                                        sx={{ mb: 3 }}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            py: 1,
                                            backgroundColor: "#3A5B22",
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                            textTransform: "none",
                                            mb: 3,
                                        }}
                                    >
                                        Login
                                    </Button>

                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography variant="body2" sx={{ color: "#666" }}>
                                            Have an account?{" "}
                                            <Link
                                                href="/signup"
                                                sx={{
                                                    color: "#1976d2",
                                                    textDecoration: "none",
                                                    fontWeight: 700,
                                                    "&:hover": {
                                                        textDecoration: "underline",
                                                    },
                                                }}
                                            >
                                                Sign Up
                                            </Link>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Container>
                    </Grid>

                    {/* Right side - VPFlow Branding */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Container
                            sx={{
                                height: "100vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                px: 4,
                            }}
                        >
                            <Box sx={{ textAlign: "center", color: "white" }}>
                                <VPFlowLogo />

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 500,
                                        color: "white",
                                        mt: 2,
                                    }}
                                >
                                    Visionary workflows, generating Prosperity
                                </Typography>
                            </Box>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}
