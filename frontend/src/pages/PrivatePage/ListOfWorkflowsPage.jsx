"use client"

import { useState } from "react"
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Button,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from "@mui/material"

import {
    Info,
    MoreVert,
    Search,
    FilterList,
    Settings,
    ImportExport,
    Add,
    BookmarkBorder,
    CalendarToday,
    Star,
} from "@mui/icons-material"

const workflowData = [
    {
        id: 1,
        name: "Credit Card",
        categories: [
            { name: "Computer Hardware", color: "#FFA726" },
            { name: "Consumer goods", color: "#5C6BC0" },
            { name: "Consumer", color: "#AB47BC" },
        ],
        lastInteraction: "27/06/2025",
        lastPublished: "27/06/2025",
        version: "Version 3.0",
        note: "",
    },
    {
        id: 2,
        name: "WF02",
        categories: [
            { name: "Automation", color: "#FF7043" },
            { name: "B2B", color: "#8D6E63" },
            { name: "B2C", color: "#8D6E63" },
            { name: "E-commerce", color: "#FFB74D" },
        ],
        lastInteraction: "27/06/2025",
        lastPublished: "26/06/2025",
        version: "Version 1.0",
        note: "",
    },
    {
        id: 3,
        name: "WF03",
        categories: [
            { name: "B2C", color: "#8D6E63" },
            { name: "Finance", color: "#FFB74D" },
            { name: "Internet", color: "#4FC3F7" },
            { name: "Marketplace", color: "#81C784" },
        ],
        lastInteraction: "26/06/2025",
        lastPublished: "25/06/2025",
        version: "Version 1.0",
        note: "Most Important",
    },
    {
        id: 4,
        name: "WF04",
        categories: [
            { name: "B2C", color: "#8D6E63" },
            { name: "Internet", color: "#4FC3F7" },
            { name: "Financial services", color: "#FFB74D" },
            { name: "Information", color: "#A5D6A7" },
        ],
        lastInteraction: "25/06/2025",
        lastPublished: "24/06/2025",
        version: "Version 1.0",
        note: "",
    },
]

export default function ListOfWorkflowsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("Last published")

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        backgroundColor: "white",
                        borderBottom: "1px solid #e0e0e0",
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

                {/* Content Area */}
                <Box sx={{ p: 3, flexGrow: 1 }}>
                    {/* Top Controls */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <FormControl size="small">
                            <Select value="All Workflows" sx={{ minWidth: 150 }}>
                                <MenuItem value="All Workflows">📊 All Workflows</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="outlined" startIcon={<Settings />} size="small">
                                View settings
                            </Button>
                            <Button variant="outlined" startIcon={<ImportExport />} size="small">
                                Import/Export
                            </Button>
                        </Box>
                    </Box>

                    {/* Search Bar */}
                    <TextField
                        fullWidth
                        placeholder="Search for something..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                    />

                    {/* Filter Controls */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button variant="outlined" size="small" startIcon={<FilterList />}>
                                Sorted by {sortBy}
                            </Button>
                            <Button variant="outlined" size="small" startIcon={<FilterList />}>
                                Filter
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="text" size="small">
                                Clear All
                            </Button>
                            <Button variant="contained" size="small">
                                Save
                            </Button>
                        </Box>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#fafafa" }}>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Add fontSize="small" />
                                            Workflow
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <BookmarkBorder fontSize="small" />
                                            Categories
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <CalendarToday fontSize="small" />
                                            Last Interaction
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Star fontSize="small" />
                                            Last Published
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <BookmarkBorder fontSize="small" />
                                            Version
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workflowData.map((workflow) => (
                                    <TableRow key={workflow.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{workflow.name}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                                {workflow.categories.map((category, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={category.name}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: category.color,
                                                            color: "white",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{workflow.lastInteraction}</TableCell>
                                        <TableCell>{workflow.lastPublished}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={workflow.version}
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#f8bbd9",
                                                    color: "#d81b60",
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {workflow.note && (
                                                <Chip
                                                    label={workflow.note}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#fff3cd",
                                                        color: "#856404",
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Footer */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {workflowData.length} count
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button variant="text" size="small" startIcon={<Add />}>
                                Add
                            </Button>
                            <Button variant="text" size="small" startIcon={<Add />}>
                                Add
                            </Button>
                            <Button variant="text" size="small" startIcon={<Add />}>
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
