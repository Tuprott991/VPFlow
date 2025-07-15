import React from 'react';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Box,
    Container,
    Typography,
    Button,
    Alert,
    Grid,
    Paper,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Info,
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

const theme = createTheme({
    palette: {
        primary: {
            main: '#4285f4',
        },
        secondary: {
            main: '#34a853',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    },
});

const WorkflowHeader = () => {
    return (
        <Box sx={{
            bgcolor: 'white',
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            py: 2
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Alert
                    severity="info"
                    icon={<Info />}
                    sx={{
                        flex: 1,
                        '& .MuiAlert-message': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }
                    }}
                >
                    <Typography variant="body2">
                        This workflow has not yet been published ( For manager to review )
                    </Typography>
                </Alert>
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3
                    }}
                >
                    Publish workflow
                </Button>
            </Box>
        </Box>
    );
};

// Component cho Roles Sidebar
const RolesSidebar = () => {
    const roleSections = [
        { title: 'CUSTOMER', color: '#ff7a7a', textColor: '#fff' },
        { title: 'Relationship Manager', color: '#ffb366', textColor: '#333' },
        { title: 'RISKS ASSESSMENT', color: '#66b3ff', textColor: '#fff' },
        { title: 'OPERATIONS', color: '#66ff66', textColor: '#333' },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {roleSections.map((section, index) => (
                <Paper
                    key={index}
                    elevation={1}
                    sx={{
                        bgcolor: section.color,
                        color: section.textColor,
                        p: 2,
                        minHeight: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderRadius: index === 0 ? '8px 8px 0 0' :
                            index === roleSections.length - 1 ? '0 0 8px 8px' : 0,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            letterSpacing: '0.5px',
                            lineHeight: 1.2,
                            transform: 'rotate(-90deg)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {section.title}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
};

// Component cho Workflow Step
const WorkflowStep = ({ title, type, position, color }) => {
    const isDecision = type === 'decision';

    return (
        <Paper
            elevation={2}
            sx={{
                position: 'absolute',
                ...position,
                width: isDecision ? 100 : 140,
                height: isDecision ? 100 : 80,
                bgcolor: color,
                border: '2px solid #333',
                borderRadius: isDecision ? '0' : 2,
                transform: isDecision ? 'rotate(45deg)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: isDecision ? 'rotate(45deg) scale(1.05)' : 'scale(1.05)',
                    boxShadow: 3,
                },
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    p: 1,
                    color: '#333',
                    transform: isDecision ? 'rotate(-45deg)' : 'none',
                    maxWidth: isDecision ? 80 : 120,
                }}
            >
                {title}
            </Typography>

            {/* Connection points */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 8,
                    height: 8,
                    bgcolor: '#333',
                    borderRadius: '50%',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 8,
                    height: 8,
                    bgcolor: '#333',
                    borderRadius: '50%',
                }}
            />
        </Paper>
    );
};

// Component cho Workflow Connector
const WorkflowConnector = ({ from, to }) => {
    const isVertical = from.left === to.left || from.right === to.right;

    if (isVertical) {
        return (
            <Box
                sx={{
                    position: 'absolute',
                    top: Math.min(from.top, to.top),
                    left: from.left,
                    right: from.right,
                    width: 2,
                    height: Math.abs(to.top - from.top),
                    bgcolor: '#333',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '8px solid #333',
                    }
                }}
            />
        );
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: from.top,
                left: Math.min(from.left || 0, to.left || 0),
                right: Math.min(from.right || 0, to.right || 0),
                height: 2,
                width: Math.abs((to.left || 0) - (from.left || 0)),
                bgcolor: '#333',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: -6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderLeft: '8px solid #333',
                }
            }}
        />
    );
};

// Component cho Workflow Diagram
const WorkflowDiagram = () => {
    return (
        <Paper
            elevation={1}
            sx={{
                height: '100%',
                p: 3,
                bgcolor: 'white',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* First Row */}
                <WorkflowStep
                    title="Submit loan application + documents"
                    type="process"
                    position={{ top: 20, left: 50 }}
                    color="#ffb3b3"
                />

                <WorkflowStep
                    title="Finish"
                    type="process"
                    position={{ top: 20, right: 50 }}
                    color="#ffb3b3"
                />

                {/* Second Row */}
                <WorkflowStep
                    title="Upload to system (LOS)"
                    type="process"
                    position={{ top: 120, left: 50 }}
                    color="#ffd199"
                />

                <WorkflowStep
                    title="Verify income employment, collateral"
                    type="process"
                    position={{ top: 120, right: 200 }}
                    color="#ffd199"
                />

                {/* Third Row */}
                <WorkflowStep
                    title="Check CIC (Credit Report)"
                    type="process"
                    position={{ top: 220, left: 50 }}
                    color="#cc99ff"
                />

                <WorkflowStep
                    title="Analyze DIT + scoring"
                    type="decision"
                    position={{ top: 220, left: 280 }}
                    color="#66b3ff"
                />

                <WorkflowStep
                    title="Flag if risk > threshold"
                    type="process"
                    position={{ top: 220, right: 150 }}
                    color="#66b3ff"
                />

                <WorkflowStep
                    title="Input into Core Lending"
                    type="process"
                    position={{ top: 220, right: 50 }}
                    color="#99ccff"
                />

                {/* Fourth Row */}
                <WorkflowStep
                    title="Input into Core Lending"
                    type="process"
                    position={{ top: 320, left: 200 }}
                    color="#99ffcc"
                />

                <WorkflowStep
                    title="Issue approval letter"
                    type="decision"
                    position={{ top: 320, left: 400 }}
                    color="#99ffcc"
                />

                <WorkflowStep
                    title="Disburse loan"
                    type="process"
                    position={{ top: 320, right: 50 }}
                    color="#99ffcc"
                />

                {/* Connectors */}
                <WorkflowConnector
                    from={{ top: 60, left: 130 }}
                    to={{ top: 120, left: 130 }}
                />
                <WorkflowConnector
                    from={{ top: 160, left: 130 }}
                    to={{ top: 220, left: 130 }}
                />
                <WorkflowConnector
                    from={{ top: 220, left: 170 }}
                    to={{ top: 220, left: 280 }}
                />
                <WorkflowConnector
                    from={{ top: 220, right: 280 }}
                    to={{ top: 120, right: 280 }}
                />
                <WorkflowConnector
                    from={{ top: 120, right: 280 }}
                    to={{ top: 60, right: 130 }}
                />
            </Box>
        </Paper>
    );
};

// Component cho Tools Panel
const ToolsPanel = () => {
    const toolSections = [
        {
            title: 'Tools',
            subtitle: 'Set the next block in the workflow',
            items: [
                { icon: <Upload />, text: 'Import file to generate workflow' }
            ]
        },
        {
            title: 'Generation',
            items: [
                { icon: <TextSnippet />, text: 'Import text to generate workflow' },
                { icon: <Delete />, text: 'Delete workflow' }
            ]
        },
        {
            title: 'Interaction',
            items: [
                { icon: <Compare />, text: 'Compare workflow' },
                { icon: <ListIcon />, text: 'Find list entries' },
                { icon: <Feedback />, text: 'Give feedback' }
            ]
        },
        {
            title: 'AI',
            items: [
                { icon: <Psychology />, text: 'Pain Point Detection', highlight: true },
                { icon: <AutoAwesome />, text: 'AI suggestion' },
                { icon: <SmartToy />, text: 'Global AI Assistant', highlight: true },
                { icon: <Description />, text: 'Auto SOP Generator' }
            ]
        }
    ];

    return (
        <Paper
            elevation={1}
            sx={{
                height: '100%',
                bgcolor: 'white',
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Tools
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Set the next block in the workflow
                </Typography>

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search blocks..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                {toolSections.map((section, sectionIndex) => (
                    <Box key={sectionIndex} sx={{ mb: 2 }}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 1,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {section.title}
                        </Typography>
                        <List dense sx={{ py: 0 }}>
                            {section.items.map((item, itemIndex) => (
                                <ListItem
                                    key={itemIndex}
                                    sx={{
                                        py: 0.5,
                                        px: 1,
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: item.highlight ? '#e3f2fd' : 'transparent',
                                        '&:hover': {
                                            bgcolor: item.highlight ? '#bbdefb' : '#f5f5f5',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {React.cloneElement(item.icon, {
                                            fontSize: 'small',
                                            color: item.highlight ? 'primary' : 'action'
                                        })}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: '0.875rem',
                                            color: item.highlight ? 'primary.main' : 'text.primary'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        {sectionIndex < toolSections.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                        )}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

// Main App Component
function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <WorkflowHeader />
                <Container maxWidth={false} sx={{ px: 2, py: 1 }}>
                    <Grid container spacing={2} sx={{ height: 'calc(100vh - 120px)' }}>
                        <Grid item xs={2}>
                            <RolesSidebar />
                        </Grid>
                        <Grid item xs={7}>
                            <WorkflowDiagram />
                        </Grid>
                        <Grid item xs={3}>
                            <ToolsPanel />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;