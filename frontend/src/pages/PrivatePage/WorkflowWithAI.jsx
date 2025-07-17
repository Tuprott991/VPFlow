import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
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
import { SwimlaneDiagram } from '@/components/ui';
import { nodeDataArray, linkDataArray } from '@/data/mock_data/swimlaneData';
import { ToolButton, ToolGroupTitle } from '@/components/custom';

const WorkflowHeader = () => (
    <Box sx={{ bgcolor: '#E5EEFF', px: 1.5, py: 1, borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IoInformationCircleOutline size={20} color="#1E3C7D" />
                <Typography fontSize={14} color="#1E3C7D" fontWeight={500}>
                    This workflow has not yet been published ( For manager to review )
                </Typography>
            </Box>
            <Button sx={{ borderRadius: '8px', px: 2, bgcolor: '#256CF1', color: 'white', fontWeight: 400 }}>
                Publish workflow
            </Button>
        </Box>
    </Box>
);

const ToolsPanel = () => (
    <Box sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '12px'
    }}>
        {/* Header */}
        <Box sx={{ p: 1.5, flexShrink: 0, bgcolor: 'white' }}>
            <Typography fontWeight={600} mb={1} sx={{ fontSize: '12px' }}>
                Tools
            </Typography>

            <ToolButton
                props={{
                    text: 'Upload file to generate workflow',
                    icon: <Upload fontSize="small" />
                }}
            />

            <TextField
                fullWidth
                size="small"
                placeholder="Search blocks..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: '#AFB0B4', fontSize: '16px' }} />
                        </InputAdornment>
                    ),
                }}
                inputProps={{
                    style: { fontSize: '12px', padding: '8px 0px' },
                }}
                sx={{
                    mb: 1,
                    borderRadius: '10px',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontSize: '12px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#EEEFF1',
                    },
                }}
            />

            <ToolGroupTitle title="Generation" />

            <ToolButton
                props={{
                    text: 'Import text to generate workflow',
                    icon: <TextSnippet fontSize="small" color="action" />
                }}
            />

            <ToolButton
                props={{
                    text: 'Delete workflow',
                    icon: <Delete fontSize="small" color="action" />
                }}
            />

            <ToolGroupTitle title="Interaction" />

            <ToolButton
                props={{
                    icon: <Compare fontSize="small" color="action" />,
                    text: 'Compare workflow'
                }}
            />

            <ToolButton
                props={{
                    icon: <ListIcon fontSize="small" color="action" />,
                    text: 'Find list entries'
                }}
            />

            <ToolButton
                props={{
                    icon: <Feedback fontSize="small" color="action" />,
                    text: 'Give feedback'
                }}
            />

            <ToolGroupTitle title="AI" />

            <ToolButton
                props={{
                    icon: <Psychology fontSize="small" color="primary" />,
                    text: 'Pain Point Detection'
                }}
            />

            <ToolButton
                props={{
                    icon: <AutoAwesome fontSize="small" color="action" />,
                    text: 'AI suggestion'
                }}
            />

            <ToolButton
                props={{
                    icon: <SmartToy fontSize="small" color="primary" />,
                    text: 'Global AI Assistant'
                }}
            />

            <ToolButton
                props={{
                    icon: <Description fontSize="small" color="action" />,
                    text: 'Auto SOP Generator'
                }}
            />

        </Box>
    </Box>
);

const App = () => (
    <Box sx={{ bgcolor: 'background.default', height: '100vh', overflow: 'hidden', width: '100%', display: 'flex' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 'calc(100% - 280px)', overflow: 'hidden' }}>
            <Box sx={{ bgcolor: 'background.default', flexShrink: 0, p: 1.5 }}>
                <WorkflowHeader />
            </Box>

            <Box sx={{ flex: 1, overflow: 'hidden', p: 1.5 }}>
                <SwimlaneDiagram
                    nodeDataArray={nodeDataArray}
                    linkDataArray={linkDataArray}
                />
            </Box>
        </Box>

        <Box
            sx={{
                width: 280,
                bgcolor: '#f8f9fa',
                borderLeft: 0.5,
                borderColor: 'divider',
                overflow: 'hidden',
                flexShrink: 0
            }}
        >
            <ToolsPanel />
        </Box>
    </Box>
);

export default App;
