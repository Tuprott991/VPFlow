import React from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Search,
    Upload,
    TextSnippet,
    Delete,
    Compare,
    List as ListIcon,
    Feedback,
    Psychology,
    AutoAwesome,
    SmartToy,
    Description
} from '@mui/icons-material';
import { IoInformationCircleOutline } from 'react-icons/io5';

const WorkflowHeader = () => (
    <Box sx={{ bgcolor: '#E5EEFF', borderBottom: 1, borderColor: 'divider', px: 1.5, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IoInformationCircleOutline size={20} color="#1E3C7D" />
                <Typography fontSize={14} color="#1E3C7D" fontWeight={500}>
                    This workflow has not yet been published ( For manager to review )
                </Typography>
            </Box>
            <Button sx={{ borderRadius: 2, px: 2, bgcolor: '#256CF1', color: 'white', fontWeight: 400 }}>
                Publish workflow
            </Button>
        </Box>
    </Box>
);

const toolSections = [
    {
        title: 'Tools',
        items: [{ icon: <Upload fontSize="small" color="action" />, text: 'Import file to generate workflow' }]
    },
    {
        title: 'Generation',
        items: [
            { icon: <TextSnippet fontSize="small" color="action" />, text: 'Import text to generate workflow' },
            { icon: <Delete fontSize="small" color="action" />, text: 'Delete workflow' }
        ]
    },
    {
        title: 'Interaction',
        items: [
            { icon: <Compare fontSize="small" color="action" />, text: 'Compare workflow' },
            { icon: <ListIcon fontSize="small" color="action" />, text: 'Find list entries' },
            { icon: <Feedback fontSize="small" color="action" />, text: 'Give feedback' }
        ]
    },
    {
        title: 'AI',
        items: [
            { icon: <Psychology fontSize="small" color="primary" />, text: 'Pain Point Detection', highlight: true },
            { icon: <AutoAwesome fontSize="small" color="action" />, text: 'AI suggestion' },
            { icon: <SmartToy fontSize="small" color="primary" />, text: 'Global AI Assistant', highlight: true },
            { icon: <Description fontSize="small" color="action" />, text: 'Auto SOP Generator' }
        ]
    }
];

const ToolsPanel = () => (
    <Box sx={{
        height: '100%',
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column'
    }}>
        {/* Header cố định */}
        <Box sx={{
            p: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
            bgcolor: 'white'
        }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Tools
            </Typography>

            <TextField
                fullWidth
                size="small"
                placeholder="Search blocks..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" fontSize="small" />
                        </InputAdornment>
                    )
                }}
            />
        </Box>

        {/* Nội dung có thể scroll */}
        <Box sx={{
            flex: 1,
            p: 1.5,
            pt: 1
        }}>
            {toolSections.map((section, i) => (
                <Box key={i} mb={1.5}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}
                    >
                        {section.title}
                    </Typography>
                    <List dense sx={{ py: 0 }}>
                        {section.items.map((item, j) => (
                            <ListItem
                                key={j}
                                sx={{
                                    py: 0.25,
                                    px: 1,
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    bgcolor: item.highlight ? '#e3f2fd' : 'transparent',
                                    '&:hover': { bgcolor: item.highlight ? '#bbdefb' : '#f5f5f5' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 28 }}>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.75rem',
                                        color: item.highlight ? 'primary.main' : 'text.primary'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ))}
        </Box>
    </Box>
);

const App = () => (
    <Box sx={{ bgcolor: 'background.default', height: '100vh', overflow: 'hidden', width: '100%', display: 'flex' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 'calc(100% - 320px)' }}>
            <Box sx={{ bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <WorkflowHeader />
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <Typography variant="h6">Workflow Content Area</Typography>
                {Array.from({ length: 50 }).map((_, index) => (
                    <Typography key={index} my={2}>
                        Content line {index + 1}
                    </Typography>
                ))}
            </Box>
        </Box>

        <Box
            sx={{
                width: 320,
                bgcolor: '#f8f9fa',
                borderLeft: 1,
                borderColor: 'divider',
                overflow: 'auto', // Thay đổi từ 'hidden' thành 'auto'
                flexShrink: 0
            }}
        >
            <ToolsPanel />
        </Box>
    </Box>
);

export default App;
