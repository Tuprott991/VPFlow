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



function LoginForm({ formData, handleChange, handleSubmit }) {
    return (
        <>
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
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
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
                                borderColor: "#ffffffff",
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
                                borderColor: "#ffffffff",
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
        </>
    )
}

// ...existing code...
export default function LoginPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })

    const handleChange = (event) =>{
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
        <Grid
            container // Thêm container prop
            sx={{
                minHeight: "100vh",
                width: "100vw",
                backgroundImage: "url('/Group39.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                margin: 0, // Loại bỏ margin mặc định
                padding: 0, // Loại bỏ padding mặc định
            }}
        >
            {/* Form section - 1/3 màn hình */}
            <Grid
                size={{xs: 12, md: 4}}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2, // Thêm padding
                }}
            >
                <Container
                    maxWidth="xs"
                    sx={{
                        width: 320,
                        backgroundColor: "rgba(255,255,255,0)",
                        borderRadius: 3,
                        boxShadow: 3,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <LoginForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                    />
                </Container>
            </Grid>

            {/* Background section - 2/3 màn hình */}
            <Grid
                size={{xs: 12, md: 8}}
                sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {/* Có thể thêm logo hoặc content khác ở đây */}
            </Grid>
        </Grid>
    </ThemeProvider>
    )

    }