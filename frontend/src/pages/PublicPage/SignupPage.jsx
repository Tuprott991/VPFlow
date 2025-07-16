"use client"

import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Grid,
    Link,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        primary: {
            main: "#2E8B57",
        },
        secondary: {
            main: "#D64545",
        },
    },
})

function SignupForm({ formData, handleChange, handleSubmit }) {
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
                Create an account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                <Typography variant="body2" sx={{ mb: 1, color: "#666", fontWeight: 500 }}>
                    Email address
                </Typography>
                <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Enter your email"
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
                    Confirm Password
                </Typography>
                <TextField
                    fullWidth
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
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
                    Sign Up
                </Button>

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            sx={{
                                color: "#1976d2",
                                textDecoration: "none",
                                fontWeight: 700,
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default function SignupPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!")
            return
        }

        console.log("Signup data:", formData)
        navigate("/list-of-workflows")
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid
                container
                sx={{
                    minHeight: "100vh",
                    width: "100vw",
                    backgroundImage: "url('/Group39.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    margin: 0,
                    padding: 0,
                }}
            >
                <Grid
                    size={{ xs: 12, md: 4 }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 2,
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
                        <SignupForm
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                        />
                    </Container>
                </Grid>

                <Grid
                    size={{ xs: 12, md: 8 }}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                />
            </Grid>
        </ThemeProvider>
    )
}
