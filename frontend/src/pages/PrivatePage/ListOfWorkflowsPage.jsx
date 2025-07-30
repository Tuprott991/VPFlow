"use client";

import { useState } from "react";
// import { Menu, MenuItem } from "@mui/material";
import {
    Box,
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
    Typography,
    Menu
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

import {
    Search,
    FilterList,
    Settings,
    ImportExport,
    CalendarToday,
    Star,
    Add,
} from "@mui/icons-material";
import { BiCategory } from "react-icons/bi";
import { SiCodemagic } from "react-icons/si";
import { CiShoppingTag } from "react-icons/ci";
import { LiaNetworkWiredSolid } from "react-icons/lia";
import { GrUpdate } from "react-icons/gr";
import {
    workflowData
} from "@/data/mock_data/workflowData.js";

export default function ListOfWorkflowsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const filteredWorkflows = workflowData.filter((workflow) =>
        workflow.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        // workflow.categories.some(category =>
        // category.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        // )
    );

    const allCategories = Array.from(
        new Set(workflowData.flatMap(wf => wf.categories.map(cat => cat.name)))
    );

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();

    return (
        <Box sx={{ p: 1.5, flexGrow: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <FormControl size="small">
                    <Select value="All Workflows" sx={{ minWidth: 180 }}>
                        <MenuItem value="All Workflows">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
                                <BiCategory size={20} />
                                All Workflows
                            </Box>
                        </MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" startIcon={<Settings />} size="small" sx={{ textTransform: "none" }}>
                        View settings
                    </Button>
                    <Button variant="outlined" startIcon={<ImportExport />} size="small" sx={{ textTransform: "none" }}>
                        Import/Export
                    </Button>
                </Box>
            </Box>

            <TextField
                fullWidth
                placeholder="Search for something..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>

                    <Button variant="outlined" size="small" startIcon={<FilterList />}>
                        Sorted by Last published
                    </Button>

                    <Button variant="outlined" size="small" startIcon={<FilterList />}
                        onClick={handleFilterClick}
                    >
                        Filter
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {allCategories.map((cat, idx) => (
                            <MenuItem key={idx} onClick={handleClose}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Menu>

                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="text" size="small">
                        Clear All
                    </Button>
                    <Button variant="contained" size="small"
                    sx={{
                        backgroundColor: '#667eea',         
                        color: '#ffffff',                   
                        textTransform: 'none',              
                        fontWeight: 600,                    
                        '&:hover': {
                        backgroundColor: '#556cd6',       
                        }
                    }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #EEEFF1" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#fff" }}>
                            <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #EEEFF1" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <LiaNetworkWiredSolid size={24} />
                                    Workflow
                                </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, borderRight: "1px solid #EEEFF1" }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    <CiShoppingTag size={24} />
                                    Categories
                                    {/* <SiCodemagic size={24} /> */}
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #EEEFF1" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CalendarToday fontSize="small" />
                                    Last Interaction
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #EEEFF1" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <GrUpdate fontSize="small" />
                                    Last Published
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, borderRight: "1px solid #EEEFF1" }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    Version
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    Note
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredWorkflows.map((workflow) => (
                            <TableRow
                                key={workflow.id}
                                hover
                                onClick={() => navigate('/workflow-details', { state: { from: 'list-of-workflows' } })}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#85e9b6ff !important',
                                    }
                                }}
                            >
                                <TableCell sx={{ fontWeight: 500, borderRight: "1px solid #EEEFF1" }}>
                                    <Typography sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                        {workflow.name}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderRight: "1px solid #EEEFF1" }}>
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
                                <TableCell sx={{ borderRight: "1px solid #EEEFF1" }}>
                                    <Typography sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                        {workflow.lastInteraction}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderRight: "1px solid #EEEFF1" }}>
                                    <Typography sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                        {workflow.lastPublished}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderRight: "1px solid #EEEFF1" }}>
                                    <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                        <Chip
                                            label={workflow.version}
                                            size="small"
                                            sx={{
                                                backgroundColor: "#FFC4DC",
                                                color: "#FF467D",
                                                fontWeight: 600,
                                            }}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                        {workflow.note && (
                                            <Chip
                                                label={workflow.note}
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#FFE7C4",
                                                    color: "#FF9B37",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ fontWeight: 500, borderRight: "1px solid #EEEFF1" }} align="right">
                                <strong>{workflowData.length}</strong> count
                            </TableCell>
                            <TableCell sx={{ borderRight: "1px solid #EEEFF1" }} align="right">
                                <Button variant="text" size="small" startIcon={<Add />}>
                                    Add
                                </Button>
                            </TableCell>
                            <TableCell sx={{ borderRight: "1px solid #EEEFF1" }} align="right">
                                <Button variant="text" size="small" startIcon={<Add />}>
                                    Add
                                </Button>
                            </TableCell>
                            <TableCell sx={{ borderRight: "1px solid #EEEFF1" }} align="right">
                                <Button variant="text" size="small" startIcon={<Add />}>
                                    Add
                                </Button>
                            </TableCell>
                            <TableCell sx={{ borderRight: "1px solid #EEEFF1" }} />
                            <TableCell />
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );
}
